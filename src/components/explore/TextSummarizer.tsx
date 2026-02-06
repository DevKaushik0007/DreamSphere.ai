 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Textarea } from "@/components/ui/textarea";
 import { Badge } from "@/components/ui/badge";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { supabase } from "@/integrations/supabase/client";
 import { useToast } from "@/hooks/use-toast";
 import {
   FileText,
   Sparkles,
   Loader2,
   Copy,
   Check,
   TrendingDown,
   Tag,
   MessageSquare,
 } from "lucide-react";
 
 interface SummaryResult {
   summary: string;
   keyPoints: string[];
   wordCount: {
     original: number;
     summary: number;
   };
   tone: string;
   topics: string[];
 }
 
 const summaryStyles = [
   { value: "concise", label: "Concise", description: "Brief bullet points" },
   { value: "detailed", label: "Detailed", description: "Comprehensive summary" },
   { value: "eli5", label: "ELI5", description: "Simple explanation" },
   { value: "professional", label: "Professional", description: "Executive summary" },
   { value: "creative", label: "Creative", description: "Engaging & vivid" },
 ];
 
 export const TextSummarizer = () => {
   const [inputText, setInputText] = useState("");
   const [style, setStyle] = useState("concise");
   const [isLoading, setIsLoading] = useState(false);
   const [result, setResult] = useState<SummaryResult | null>(null);
   const [copied, setCopied] = useState(false);
   const { toast } = useToast();
 
   const handleSummarize = async () => {
     if (!inputText.trim()) {
       toast({
         title: "Enter text to summarize",
         description: "Please paste or type the content you want to summarize",
         variant: "destructive",
       });
       return;
     }
 
     if (inputText.length < 50) {
       toast({
         title: "Text too short",
         description: "Please provide at least 50 characters to summarize",
         variant: "destructive",
       });
       return;
     }
 
     setIsLoading(true);
     setResult(null);
 
     try {
       const { data, error } = await supabase.functions.invoke("summarize-text", {
         body: { text: inputText, style },
       });
 
       if (error) throw error;
 
       if (data.error) {
         throw new Error(data.error);
       }
 
       setResult(data.result);
       toast({
         title: "Summary generated!",
         description: "Your AI summary is ready",
       });
     } catch (error: any) {
       console.error("Summarization error:", error);
       toast({
         title: "Summarization failed",
         description: error.message || "Something went wrong",
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   const copyToClipboard = async () => {
     if (!result?.summary) return;
     await navigator.clipboard.writeText(result.summary);
     setCopied(true);
     toast({ title: "Copied to clipboard!" });
     setTimeout(() => setCopied(false), 2000);
   };
 
   const reductionPercent = result
     ? Math.round(
         ((result.wordCount.original - result.wordCount.summary) /
           result.wordCount.original) *
           100
       )
     : 0;
 
   return (
     <div className="space-y-6">
       {/* Input Section */}
       <Card className="glass-card border-white/10">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <FileText className="w-5 h-5 text-primary" />
             Paste Your Content
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <Textarea
             placeholder="Paste your long-form content here... articles, essays, documents, or any text you want summarized."
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             className="min-h-[200px] bg-muted/30 border-white/10 resize-none"
           />
 
           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
             <div className="flex items-center gap-3">
               <span className="text-sm text-muted-foreground">Style:</span>
               <Select value={style} onValueChange={setStyle}>
                 <SelectTrigger className="w-[180px] bg-muted/30 border-white/10">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {summaryStyles.map((s) => (
                     <SelectItem key={s.value} value={s.value}>
                       <div className="flex flex-col">
                         <span>{s.label}</span>
                         <span className="text-xs text-muted-foreground">
                           {s.description}
                         </span>
                       </div>
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
 
             <div className="flex items-center gap-3">
               <span className="text-sm text-muted-foreground">
                 {inputText.split(/\s+/).filter(Boolean).length} words
               </span>
               <Button
                 variant="dream"
                 onClick={handleSummarize}
                 disabled={isLoading}
               >
                 {isLoading ? (
                   <Loader2 className="w-4 h-4 animate-spin mr-2" />
                 ) : (
                   <Sparkles className="w-4 h-4 mr-2" />
                 )}
                 Summarize
               </Button>
             </div>
           </div>
         </CardContent>
       </Card>
 
       {/* Loading State */}
       {isLoading && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="text-center py-8"
         >
           <div className="inline-flex items-center gap-3 glass-card px-6 py-4 rounded-2xl">
             <Loader2 className="w-5 h-5 animate-spin text-primary" />
             <span>AI is analyzing your content...</span>
           </div>
         </motion.div>
       )}
 
       {/* Results */}
       {result && !isLoading && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-4"
         >
           {/* Stats Row */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <Card className="glass-card border-white/10 p-4">
               <div className="flex items-center gap-2 text-muted-foreground mb-1">
                 <FileText className="w-4 h-4" />
                 <span className="text-xs">Original</span>
               </div>
               <p className="text-xl font-bold">{result.wordCount.original}</p>
               <p className="text-xs text-muted-foreground">words</p>
             </Card>
 
             <Card className="glass-card border-white/10 p-4">
               <div className="flex items-center gap-2 text-muted-foreground mb-1">
                 <Sparkles className="w-4 h-4" />
                 <span className="text-xs">Summary</span>
               </div>
               <p className="text-xl font-bold">{result.wordCount.summary}</p>
               <p className="text-xs text-muted-foreground">words</p>
             </Card>
 
             <Card className="glass-card border-green-500/20 p-4">
               <div className="flex items-center gap-2 text-green-500 mb-1">
                 <TrendingDown className="w-4 h-4" />
                 <span className="text-xs">Reduced</span>
               </div>
               <p className="text-xl font-bold text-green-500">{reductionPercent}%</p>
               <p className="text-xs text-muted-foreground">shorter</p>
             </Card>
 
             <Card className="glass-card border-white/10 p-4">
               <div className="flex items-center gap-2 text-muted-foreground mb-1">
                 <MessageSquare className="w-4 h-4" />
                 <span className="text-xs">Tone</span>
               </div>
               <p className="text-lg font-semibold capitalize">{result.tone}</p>
             </Card>
           </div>
 
           {/* Summary Card */}
           <Card className="glass-card border-primary/20">
             <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle className="flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-primary" />
                 AI Summary
               </CardTitle>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={copyToClipboard}
                 className="gap-2"
               >
                 {copied ? (
                   <Check className="w-4 h-4 text-green-500" />
                 ) : (
                   <Copy className="w-4 h-4" />
                 )}
                 {copied ? "Copied!" : "Copy"}
               </Button>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                 {result.summary}
               </p>
             </CardContent>
           </Card>
 
           {/* Key Points */}
           {result.keyPoints.length > 0 && (
             <Card className="glass-card border-white/10">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-lg">
                   <Tag className="w-5 h-5 text-accent" />
                   Key Points
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <ul className="space-y-2">
                   {result.keyPoints.map((point, i) => (
                     <li key={i} className="flex items-start gap-2">
                       <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                         {i + 1}
                       </span>
                       <span className="text-muted-foreground">{point}</span>
                     </li>
                   ))}
                 </ul>
               </CardContent>
             </Card>
           )}
 
           {/* Topics */}
           {result.topics.length > 0 && (
             <div className="flex flex-wrap gap-2">
               <span className="text-sm text-muted-foreground mr-2">Topics:</span>
               {result.topics.map((topic, i) => (
                 <Badge key={i} variant="secondary">
                   {topic}
                 </Badge>
               ))}
             </div>
           )}
         </motion.div>
       )}
     </div>
   );
 };