"use client"

import { useState, useEffect } from "react"
import { Copy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function PasswordGenerator() {
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const generatePassword = () => {
    let charset = ""
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-="

    // Ensure at least one character set is selected
    if (charset === "") {
      setPassword("")
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return
    }

    let newPassword = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset[randomIndex]
    }

    setPassword(newPassword)
    calculatePasswordStrength(newPassword)
  }

  const calculatePasswordStrength = (pwd: string) => {
    // Simple password strength calculation
    let strength = 0

    // Length contribution (up to 40%)
    strength += Math.min(40, (pwd.length / 20) * 40)

    // Character variety contribution (up to 60%)
    const hasLower = /[a-z]/.test(pwd)
    const hasUpper = /[A-Z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd)

    const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length
    strength += (varietyCount / 4) * 60

    setPasswordStrength(Math.round(strength))
  }

  const copyToClipboard = () => {
    if (!password) return

    navigator.clipboard.writeText(password)
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    })
  }

  // Generate password on initial load and when criteria changes
  useEffect(() => {
    generatePassword()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500"
    if (passwordStrength < 60) return "bg-yellow-500"
    if (passwordStrength < 80) return "bg-green-500"
    return "bg-emerald-500"
  }

  const getStrengthLabel = () => {
    if (passwordStrength < 30) return "Weak"
    if (passwordStrength < 60) return "Fair"
    if (passwordStrength < 80) return "Good"
    return "Strong"
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Password Generator</CardTitle>
          <CardDescription>Create strong, secure passwords with customizable options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-muted rounded-md font-mono text-base break-all">
              {password || "Generate a password"}
              {password && (
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="ml-2">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy password</span>
                </Button>
              )}
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Password strength:</span>
                <span className="font-medium">{getStrengthLabel()}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()} transition-all duration-300`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="length">Password Length: {length}</Label>
              </div>
              <Slider
                id="length"
                min={4}
                max={32}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase">Include Uppercase</Label>
                <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase">Include Lowercase</Label>
                <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="numbers">Include Numbers</Label>
                <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="symbols">Include Symbols</Label>
                <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generatePassword}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
