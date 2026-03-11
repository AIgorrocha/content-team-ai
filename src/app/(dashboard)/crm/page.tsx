import { KanbanBoard } from "@/components/crm/kanban-board"

export default function CrmPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">CRM Pipeline</h1>
      <KanbanBoard />
    </div>
  )
}
