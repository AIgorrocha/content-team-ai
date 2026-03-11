import { ContactTable } from "@/components/crm/contact-table"

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Contatos</h1>
      <ContactTable />
    </div>
  )
}
