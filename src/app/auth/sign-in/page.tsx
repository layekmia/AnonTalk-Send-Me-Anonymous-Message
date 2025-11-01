"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"

export default function Page() {
  const [username, setUsername] = useState('');
  const [usernameMessagge, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  return (
    <div>page</div>
  )
}