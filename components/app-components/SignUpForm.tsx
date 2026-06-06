"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { useState, type ComponentPropsWithoutRef, type ChangeEvent, type SubmitEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { registerUser } from "@/actions/auth/register"
import { useRouter } from "next/navigation"



export function SignupForm({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const router = useRouter()
  const [formData, setformData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const { name, value } = e.target;
      setformData((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    if (
      formData.fullName === "" &&
      formData.email === "" && 
      formData.phone === "" &&
      formData.password === ""
    ) {
      setError("All fields are required!");
      return;
    }

    try {
      const loggedIn = await registerUser(formData);
      if (loggedIn) {
        router.push("/catalog")
      }else{
        setError("An error occured!")
      }
    } catch (err) {
      setError("An error occured!");
      console.error("Login error:", err);
    }

  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email below to create your account
                </p>
              </div>
              <Field>
                <Field className="">
                  <Field>
                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                    <Input
                      onChange={handleInputChange}
                      name="fullName"
                      value={formData.fullName}
                      id="fullName"
                      placeholder="John Doe Appleseed"
                      type="text"
                      required
                    />
                  </Field>
                </Field>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="mail@example.com"
                  required
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="mail@example.com"
                  required
                  onChange={handleInputChange}
                  value={formData.phone}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      value={formData.password}
                      onChange={handleInputChange}
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button disabled={loading} type="submit">
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                {error && <div className="text-sm text-red-500">{error}</div>}
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              width={500}
              height={500}
              src={"/bespoke.webp"}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
