import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";

export async function getPayments() {
    const admin = await requireAdmin()
    function formatDate(date: Date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}`;
    }

    try {
        const payments = await prisma.payment.findMany({
            where: {
                status: "PAID"
            }
        })
        return payments.map(pmt => ({date: formatDate(pmt.paidAt), status: pmt.status, amount: pmt.amount}));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(message);
    }
}