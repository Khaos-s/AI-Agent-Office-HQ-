create schema if not exists office_private;
revoke all on schema office_private from public;
grant usage on schema office_private to authenticated;

create table public.office_operators (email text primary key check (email = lower(email)));
alter table public.office_operators enable row level security;
revoke all on public.office_operators from anon, authenticated;
grant select on public.office_operators to authenticated;
create policy own_operator on public.office_operators for select to authenticated using (email = (select auth.jwt()->>'email'));
insert into public.office_operators(email) values ('johnarveylopez0@gmail.com');

create function office_private.is_operator() returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from auth.users u join public.office_operators o on o.email = lower(u.email)
    where u.id = auth.uid() and u.email_confirmed_at is not null
  );
$$;
revoke all on function office_private.is_operator() from public, anon;
grant execute on function office_private.is_operator() to authenticated;

create table public.office_agents (id text primary key, data jsonb not null check (jsonb_typeof(data) = 'object' and data ? 'id' and data->>'id' = id));
create table public.office_memories (id text primary key, data jsonb not null check (jsonb_typeof(data) = 'object' and data ? 'id' and data->>'id' = id));
create table public.office_approvals (id text primary key, data jsonb not null check (jsonb_typeof(data) = 'object' and data ? 'id' and data->>'id' = id and data ? 'status' and data->>'status' in ('pending','approved','rejected')));
create table public.office_radar (id text primary key, data jsonb not null check (jsonb_typeof(data) = 'object' and data ? 'id' and data->>'id' = id));
create table public.office_audit (
  id bigint generated always as identity primary key,
  approval_id text not null references public.office_approvals(id),
  actor_id uuid,
  event text not null check (event in ('created','imported','approved','rejected','sandbox_execution')),
  record jsonb not null,
  created_at timestamptz not null default now()
);

do $$ declare t text; begin
  foreach t in array array['office_agents','office_memories','office_approvals','office_radar','office_audit'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from anon, authenticated',t);
    execute format('grant select on public.%I to authenticated',t);
    execute format('create policy operator_read on public.%I for select to authenticated using ((select office_private.is_operator()))',t);
  end loop;
  foreach t in array array['office_memories','office_approvals'] loop
    execute format('grant insert on public.%I to authenticated',t);
    execute format('create policy operator_insert on public.%I for insert to authenticated with check ((select office_private.is_operator()))',t);
  end loop;
  foreach t in array array['office_agents','office_approvals','office_radar'] loop
    execute format('grant update on public.%I to authenticated',t);
    execute format('create policy operator_update on public.%I for update to authenticated using ((select office_private.is_operator())) with check ((select office_private.is_operator()))',t);
  end loop;
end $$;

create function office_private.guard_agent() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.id <> old.id or
    (new.data - array['currentCoordinates','targetCoordinates','movement','currentRoom','status','currentTask','speechBubble']) <>
    (old.data - array['currentCoordinates','targetCoordinates','movement','currentRoom','status','currentTask','speechBubble']) then
    raise exception 'Agent identity, department and tool boundaries are immutable';
  end if;
  return new;
end;
$$;
revoke all on function office_private.guard_agent() from public, anon, authenticated;
create trigger agent_boundaries before update on public.office_agents for each row execute function office_private.guard_agent();

create function office_private.guard_approval() returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null and (new.data->>'status' <> 'pending' or new.data ? 'executionReceipt') then
      raise exception 'New approvals must be pending without an execution receipt';
    end if;
  else
    if old.data->>'status' <> 'pending' or new.data->>'status' not in ('approved','rejected') then
      raise exception using errcode = '40001', message = 'Approval already resolved or transition invalid';
    end if;
    if new.id <> old.id or (new.data - array['status','resolvedAt','resolvedBy','resolutionComment','executionReceipt']) <> (old.data - array['status','resolvedAt','resolvedBy','resolutionComment','executionReceipt']) then
      raise exception 'Approval request details are immutable';
    end if;
    if new.data ? 'executionReceipt' and (new.data->>'status' <> 'approved' or new.data->'executionReceipt'->>'sandboxMode' is distinct from 'true') then
      raise exception 'Only approved sandbox receipts are supported';
    end if;
    new.data = new.data || jsonb_build_object('resolvedAt',now(),'resolvedBy',auth.uid());
  end if;
  return new;
end;
$$;
revoke all on function office_private.guard_approval() from public, anon, authenticated;
create trigger approval_transition before insert or update on public.office_approvals for each row execute function office_private.guard_approval();

-- The trigger alone can append audit rows; operators cannot edit or delete them.
create function office_private.audit_approval() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.office_audit(approval_id,actor_id,event,record)
  values(new.id,auth.uid(),case when tg_op='INSERT' then case when auth.uid() is null then 'imported' else 'created' end else new.data->>'status' end,new.data);
  if tg_op='UPDATE' and new.data ? 'executionReceipt' then
    insert into public.office_audit(approval_id,actor_id,event,record) values(new.id,auth.uid(),'sandbox_execution',new.data->'executionReceipt');
  end if;
  return new;
end;
$$;
revoke all on function office_private.audit_approval() from public, anon, authenticated;
create trigger approval_audit after insert or update on public.office_approvals for each row execute function office_private.audit_approval();
