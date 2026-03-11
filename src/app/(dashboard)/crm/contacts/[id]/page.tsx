"use client"

import { useParams } from "next/navigation"
import { ContactDetail } from "@/components/crm/contact-detail"

export default function ContactDetailPage() {
  const params = useParams()
  const id = params.id as string

  return <ContactDetail contactId={id} />
}
