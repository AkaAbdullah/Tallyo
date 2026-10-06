import "server-only";
import { CURRENCIES_SORTED } from "@/lib/geo";
import { formatInvoiceNumber, todayISO } from "@/lib/money";
import { ClientModel } from "@/models/client";
import { businessDTO, clientDTO } from "@/server/dto";
import { requireWorkspace } from "@/server/session";

/** Everything the invoice editor needs from the workspace. */
export async function loadEditorContext() {
  const { workspace, business } = await requireWorkspace();
  const clients = await ClientModel.find({ organizationId: workspace.id }).sort({ name: 1 }).lean();
  const b = businessDTO(business);
  return {
    workspace,
    business: b,
    clients: clients.map(clientDTO),
    currencies: CURRENCIES_SORTED,
    defaults: {
      issueDate: todayISO(),
      termsDays: b.defaultTermsDays,
      currency: b.defaultCurrency,
      notes: b.defaultNotes,
      nextNumber: formatInvoiceNumber(b.invoicePrefix, b.numberDigits, b.nextNumber),
    },
  };
}
