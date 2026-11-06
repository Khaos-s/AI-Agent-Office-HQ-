import { HITLApproval } from "@/types";

export interface ExecutionReceipt {
  success: boolean;
  actionType: string;
  approvalId: string;
  executedAt: string;
  sandboxMode: boolean;
  [key: string]: any;
}

export async function executeApprovedAction(approval: HITLApproval): Promise<ExecutionReceipt> {
  const executedAt = new Date().toISOString();

  switch (approval.actionType) {
    case "shopify_refund": {
      const orderId = approval.payload.orderId || "unknown";
      const amount = Number(approval.payload.amount) || 0;
      const currency = approval.payload.currency || "USD";

      return {
        success: true,
        actionType: approval.actionType,
        approvalId: approval.id,
        executedAt,
        sandboxMode: true,
        transactionId: `txn_shp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
        gateway: "Shopify Payments (Simulated Sandbox)",
        details: {
          orderId,
          amount,
          currency,
          authCode: "AUTH_MOCK_SUCCESS_8471",
        },
      };
    }

    case "social_publish": {
      const platform = approval.payload.platform || "twitter";
      const content = approval.payload.content || "";

      return {
        success: true,
        actionType: approval.actionType,
        approvalId: approval.id,
        executedAt,
        sandboxMode: true,
        platform,
        characterCount: content.length,
        simulatedUrl: `https://${platform}.com/ai_agent_office/status/${Date.now()}`,
        status: "published_to_feed",
      };
    }

    case "email_send": {
      const recipient = approval.payload.recipient || "unknown";
      const subject = approval.payload.subject || "No Subject";

      return {
        success: true,
        actionType: approval.actionType,
        approvalId: approval.id,
        executedAt,
        sandboxMode: true,
        messageId: `msg_${Date.now().toString(36)}@mail.ai-office.internal`,
        recipient,
        subject,
        status: "queued_for_delivery",
      };
    }

    default: {
      return {
        success: true,
        actionType: approval.actionType,
        approvalId: approval.id,
        executedAt,
        sandboxMode: true,
        message: `Generic action ${approval.actionType} executed in sandbox mode`,
        payloadSnapshot: approval.payload,
      };
    }
  }
}

