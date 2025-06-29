import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"

import { SignInView } from "@/modules/auth/ui/sign-in-page"

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!!session) {
    redirect("/")
  }

  return <SignInView />
}

export default Page