import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { UsersPageClient } from "@/components/users-page-client"

export default async function UsuariosPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  if (session.rol !== "administrador") redirect("/dashboard")

  return <UsersPageClient currentUser={session} />
}
