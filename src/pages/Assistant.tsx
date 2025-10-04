import { useState } from "react";
import { Send, Sparkles, FileText, AlertCircle } from "lucide-react";
import { HeaderSummary } from "@/components/HeaderSummary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Chip } from "@/components/Chip";
import { AINutritionLabel } from "@/components/AINutritionLabel";
import { sendAssistantMessage } from "@/services/mockApi";
import type { AssistantMessage, AssistantResponse } from "@/types";
import { toast } from "sonner";

const Assistant = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AssistantResponse | null>(null);
  const [showNutritionLabel, setShowNutritionLabel] = useState(false);

  const suggestedPrompts = [
    "Improve cash buffer",
    "Reduce DSO",
    "Plan seasonality",
    "Manage payables"
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: AssistantMessage = {
      role: "user",
      text: text.trim(),
      ts: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendAssistantMessage([...messages, userMessage]);
      const assistantMessage: AssistantMessage = {
        role: "assistant",
        text: response.answer,
        ts: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentResponse(response);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderSummary inAmount={245000} outAmount={187000} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-6 h-[calc(100vh-280px)]">
          <Card className="shadow-card flex flex-col">
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Financial Assistant</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowNutritionLabel(true)}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Info
                </Button>
              </div>
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <Chip
                      key={prompt}
                      variant="info"
                      className="cursor-pointer hover:bg-accent/20"
                      onClick={() => handleSend(prompt)}
                    >
                      {prompt}
                    </Chip>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <Sparkles className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-foreground">How can I help?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ask me about improving your cash position, managing receivables, or planning ahead
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-subtle" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-subtle" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-subtle" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about cash management..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(input)}
                  disabled={isLoading}
                />
                <Button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="shadow-card p-5 space-y-4 overflow-y-auto">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Intelligent Compliance</h3>
            </div>

            {currentResponse ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-error" />
                    Risks
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {currentResponse.complianceBrief.risks.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-success" />
                    Mitigations
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {currentResponse.complianceBrief.mitigations.map((mit, idx) => (
                      <li key={idx}>{mit}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Policy Links</h4>
                  <div className="space-y-1">
                    {currentResponse.complianceBrief.policyLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="text-sm text-accent hover:underline block"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Sources</h4>
                  <div className="space-y-1">
                    {currentResponse.sources.map((source, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground">
                        • {source.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-center">
                <p className="text-sm text-muted-foreground">
                  Send a message to generate a compliance brief
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {currentResponse && (
        <AINutritionLabel
          isOpen={showNutritionLabel}
          onClose={() => setShowNutritionLabel(false)}
          label={currentResponse.nutritionLabelRef}
        />
      )}
    </div>
  );
};

export default Assistant;
