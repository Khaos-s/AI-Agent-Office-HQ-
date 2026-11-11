-- Run against the migrated database as postgres. All fixtures are rolled back.
begin;
insert into auth.users(id,email,email_confirmed_at) values
  ('00000000-0000-4000-8000-000000000091','office-check@example.invalid',now()),
  ('00000000-0000-4000-8000-000000000092','outsider-check@example.invalid',now());
insert into public.office_operators(email) values ('office-check@example.invalid');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000091","email":"office-check@example.invalid","role":"authenticated"}',true);
do $$ declare n integer; begin
  if (select count(*) from public.office_agents) <> 24 then raise exception 'Operator roster access failed'; end if;
  insert into public.office_approvals(id,data) values ('verification-rollback', '{"id":"verification-rollback","status":"pending","title":"Verification only"}');
  update public.office_approvals set data=data || '{"status":"approved","executionReceipt":{"sandboxMode":true}}'::jsonb where id='verification-rollback' and data->>'status'='pending';
  if (select count(*) from public.office_audit where approval_id='verification-rollback') <> 3 then raise exception 'Audit append failed'; end if;
  if (select data->>'resolvedBy' from public.office_approvals where id='verification-rollback') <> auth.uid()::text then raise exception 'Reviewer identity failed'; end if;
  update public.office_approvals set data=data || '{"status":"rejected"}'::jsonb where id='verification-rollback' and data->>'status'='pending';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'Repeated decision changed the record'; end if;
  begin
    update public.office_approvals set data=data || '{"status":"rejected"}'::jsonb where id='verification-rollback';
    raise exception 'Terminal record was mutable';
  exception when serialization_failure then null; end;
  begin
    update public.office_agents set data=data || '{"name":"forged"}'::jsonb where id=(select id from public.office_agents limit 1);
    raise exception 'Agent identity was mutable';
  exception when raise_exception then
    if sqlerrm <> 'Agent identity, department and tool boundaries are immutable' then raise; end if;
  end;
  if has_table_privilege('authenticated','public.office_audit','UPDATE') or has_table_privilege('authenticated','public.office_audit','DELETE') or has_table_privilege('authenticated','public.office_audit','INSERT') then raise exception 'Audit write privileges exposed'; end if;
end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000092","email":"outsider-check@example.invalid","role":"authenticated"}',true);
do $$ begin
  if exists(select 1 from public.office_agents) or exists(select 1 from public.office_approvals) or exists(select 1 from public.office_memories) or exists(select 1 from public.office_audit) then raise exception 'Outsider read access leaked'; end if;
  begin
    insert into public.office_memories(id,data) values('outsider-write','{"id":"outsider-write"}');
    raise exception 'Outsider write succeeded';
  exception when insufficient_privilege then null; end;
end $$;
set local role anon;
do $$ begin
  begin
    perform 1 from public.office_agents;
    raise exception 'Anonymous read succeeded';
  exception when insufficient_privilege then null; end;
end $$;
rollback;
