import { describe, it, expect } from "vitest";
import { executeApprovedAction } from "@/lib/action-handlers";
import { HITLApproval } from "@/types";

describe("HITL Action Execution Handlers", () => {
  it("executes shopify refund with verified sandbox receipt", async () => {
    const approval: HITLApproval = {
      id: "app-test-1",
      agentId: "tbx-shop",
      actionType: "shopify_refund",
      title: "Test Refund",
      description: "Refund order",
      riskLevel: "high",
      payload: { orderId: "999", amount: 120.0, currency: "USD" },
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const receipt = await executeApprovedAction(approval);
    expect(receipt.success).toBe(true);
    expect(receipt.transactionId).toBeDefined();
    expect(receipt.details.amount).toBe(120.0);
    expect(receipt.sandboxMode).toBe(true);
  });

  it("executes social publishing with simulated post URL", async () => {
    const approval: HITLApproval = {
      id: "app-test-2",
      agentId: "social",
      actionType: "social_publish",
      title: "Test Post",
      description: "Post to Twitter",
      riskLevel: "low",
      payload: { platform: "twitter", content: "Hello world from Agent HQ!" },
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const receipt = await executeApprovedAction(approval);
    expect(receipt.success).toBe(true);
    expect(receipt.simulatedUrl).toContain("twitter.com");
  });

  it("executes email sending with delivery ID", async () => {
    const approval: HITLApproval = {
      id: "app-test-3",
      agentId: "inbox",
      actionType: "email_send",
      title: "Test Email",
      description: "Send partnership response",
      riskLevel: "high",
      payload: { recipient: "partner@example.com", subject: "Partnership Agreement" },
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const receipt = await executeApprovedAction(approval);
    expect(receipt.success).toBe(true);
    expect(receipt.messageId).toBeDefined();
    expect(receipt.status).toBe("queued_for_delivery");
  });
});
