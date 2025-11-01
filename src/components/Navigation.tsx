"use client";
import Link from "next/link";

import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function Navigation() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link className="text-xl font-bold mb-4 md:mb-0" href="/">
          AnonTalk
        </Link>
        {session ? (
          <>
            <span className="mr-4">Welcome, {session.user.username}</span>{" "}
            <Button
              className="w-full md:w-auto cursor-pointer"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
