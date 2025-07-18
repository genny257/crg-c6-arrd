"use client"

import * as React from "react"
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { chat } from "@/ai/flows/chatbot-flow"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface Message {
  role: "user" | "model"
  content: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    { role: "model", content: "Bonjour ! Comment puis-je vous aider aujourd'hui concernant la Croix-Rouge Gabonaise ?" }
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input || isLoading) return

    setIsLoading(true)
    const newMessages: Message[] = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")

    try {
      const response = await chat(messages, input)
      setMessages([...newMessages, { role: "model", content: response }])
    } catch (error) {
      console.error("Chatbot error:", error)
      setMessages([...newMessages, { role: "model", content: "Désolé, une erreur est survenue. Veuillez réessayer." }])
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: "smooth"
        });
    }
  }, [messages])

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="rounded-full w-14 h-14 shadow-lg" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          <span className="sr-only">Ouvrir le chatbot</span>
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <Card className="w-[350px] shadow-2xl rounded-lg flex flex-col h-[500px]">
            <CardHeader className="flex flex-row items-center gap-3">
               <Bot className="h-8 w-8 text-primary" />
               <div>
                <CardTitle className="font-headline text-lg">Assistant Virtuel</CardTitle>
                <CardDescription>Croix-Rouge Gabonaise</CardDescription>
               </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex w-max max-w-[85%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                        message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      {message.content}
                    </div>
                  ))}
                   {isLoading && (
                    <div className="flex items-center space-x-2">
                        <div className="bg-muted rounded-full p-2">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="bg-muted rounded-lg px-4 py-2 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    </div>
                   )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..."
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Envoyer</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}
