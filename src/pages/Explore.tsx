import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { searchYouTube } from "@/services/youtube";
import { searchWeb } from "@/services/webSearch";


import {
  Search,
  Sparkles,
  Globe,
  Youtube,
  Twitter,
  Instagram,
  Play,
  ExternalLink,
  Heart,
  MessageCircle,
  Repeat2,
  Clock,
  TrendingUp,
  Lightbulb,
  Smile,
  Loader2,
  CheckCircle,
   Zap,
   Linkedin,
   Briefcase,
   MapPin,
   Users
} from "lucide-react";
 import { TextSummarizer } from "@/components/explore/TextSummarizer";

interface SearchResults {
  summary: {
    overview: string;
    keyInsights: string[];
    emotionalTone: string;
    actionableTips: string[];
  };
  google: Array<{
    title: string;
    url: string;
    snippet: string;
    source: string;
    date: string;
  }>;
  youtube: Array<{
    title: string;
    channelName: string;
    views: string;
    duration: string;
    thumbnail: string;
    publishedAt: string;
  }>;
  twitter: Array<{
    username: string;
    displayName: string;
    content: string;
    likes: number;
    retweets: number;
    time: string;
    verified: boolean;
  }>;
  instagram: Array<{
    username: string;
    caption: string;
    likes: string;
    gradient: string;
  }>;
  shorts: Array<{
    title: string;
    channelName: string;
    views: string;
    gradient: string;
  }>;
   linkedin: Array<{
     name: string;
     headline: string;
     location: string;
     connectionDegree: string;
     mutualConnections: number;
     isHiring: boolean;
     postType: string;
   }>;
}

const gradients = [
  "from-purple-500 via-pink-500 to-red-500",
  "from-blue-500 via-teal-500 to-green-500",
  "from-orange-500 via-red-500 to-pink-500",
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-green-400 via-cyan-500 to-blue-500"
];


const Explore = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [mainSection, setMainSection] = useState<"search" | "summarize">("search");
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [webLive, setWebLive] = useState([]);


// const saveSearchToBackend = async (query: string, platform: string) => {
//   try {
//     await fetch("http://localhost:5000/api/search", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         query,
//         platform,
//         userId: user?.id, // 👈 Supabase user id
//       }),
//     });
//   } catch (err) {
//     console.error("Failed to save search:", err);
//   }
// };

const saveSearchToBackend = async (query: string, platform: string) => {
  try {
    const API = import.meta.env.VITE_API_BASE_URL;

    await fetch(`${API}/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        platform,
        userId: user?.id || null, // safe fallback
      }),
    });
  } catch (err) {
    console.error("Failed to save search:", err);
  }
};




  const openTwitterSearch = (query: string) => {
  const url = `https://twitter.com/search?q=${encodeURIComponent(query)}&f=live`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const openLinkedInPeople = (query: string) => {
  window.open(
    `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`,
    "_blank",
    "noopener,noreferrer"
  );
};

const openLinkedInJobs = (query: string) => {
  window.open(
    `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}`,
    "_blank",
    "noopener,noreferrer"
  );
};

const openLinkedInPosts = (query: string) => {
  window.open(
    `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(query)}`,
    "_blank",
    "noopener,noreferrer"
  );
};

const openInstagramSearch = (query: string) => {
  window.open(
    `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(query)}`,
    "_blank",
    "noopener,noreferrer"
  );
};

const openInstagramHashtag = (query: string) => {
  const tag = query.replace(/\s+/g, "");
  window.open(
    `https://www.instagram.com/explore/tags/${tag}/`,
    "_blank",
    "noopener,noreferrer"
  );
};

// const openInstagramProfile = (query: string) => {
//   const username = query.replace(/\s+/g, "").toLowerCase();
//   window.open(
//     `https://www.instagram.com/${username}/`,
//     "_blank",
//     "noopener,noreferrer"
//   );
// };

const openInstagramProfile = (query: string) => {
  window.open(
    `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(query)}`,
    "_blank",
    "noopener,noreferrer"
  );
};


  const [youtubeLive, setYoutubeLive] = useState<Array<{
    title: string;
    channelName: string;
    views: string;
    duration: string;
    thumbnail: string;
    publishedAt: string;
    url: string;
  }>>([]);
  

  const [shortsLive, setShortsLive] = useState<Array<{
  title: string;
  channelName: string;
  thumbnail: string;
  url: string;
}>>([]);


  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Enter a search query",
        description: "Please type something to search for",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setResults(null);

    await saveSearchToBackend(query, "global");


    // 🔴 Fetch LIVE YouTube videos (FREE API)
try {
  const ytResults = await searchYouTube(query);

  const formatted = ytResults.map((v: any) => ({
    title: v.title,
    channelName: v.channel,
    views: "Live on YouTube",
    duration: "Watch",
    thumbnail: v.thumbnail,
    publishedAt: "YouTube",
    url: v.url,
  }));

  setYoutubeLive(formatted);
} catch (e) {
  console.error("YouTube live fetch failed", e);
}


// 🔴 Fetch LIVE YouTube Shorts
try {
  const ytResults = await searchYouTube(query + " #shorts");

  const shorts = ytResults
    .filter((v: any) => v.durationInSeconds && v.durationInSeconds <= 60)
    .map((v: any) => ({
      title: v.title,
      channelName: v.channel,
      thumbnail: v.thumbnail,
      url: v.url.replace("watch?v=", "shorts/"),
    }));

  setShortsLive(shorts.slice(0, 10));
} catch (e) {
  console.error("Shorts fetch failed", e);
}

const webResults = await searchWeb(query);
setWebLive(webResults);


    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query, mood: profile?.mood_preference }
      });

      if (error) throw error;

      setResults(data.results);

      // Save to search history
      if (user) {
        await supabase.from('search_history').insert({
          user_id: user.id,
          query,
          mood: profile?.mood_preference,
          ai_summary: data.results.summary,
          results: data.results
        });
      }

      toast({
        title: "Search complete!",
        description: "AI-powered results are ready",
      });

    } catch (error: unknown) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Something went wrong while searching. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getRandomGradient = (index: number) => gradients[index % gradients.length];

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI Super Search Hub</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Explore & <span className="text-gradient-aurora">Discover</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Search across the entire web with AI-powered insights tailored to your mood
            </p>

            {/* Search Bar */}
             <div className="max-w-2xl mx-auto space-y-4">
               {/* Section Toggle */}
               <div className="flex justify-center gap-2">
                 <Button
                   variant={mainSection === "search" ? "dream" : "outline"}
                   onClick={() => setMainSection("search")}
                   className="gap-2"
                 >
                   <Search className="w-4 h-4" />
                   AI Search
                 </Button>
                 <Button
                   variant={mainSection === "summarize" ? "dream" : "outline"}
                   onClick={() => setMainSection("summarize")}
                   className="gap-2"
                 >
                   <Sparkles className="w-4 h-4" />
                   Summarize Text
                 </Button>
               </div>
 
               {mainSection === "search" && (
               <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="What would you like to explore?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-14 text-lg bg-card/50 border-white/10"
                />
              </div>
              <Button 
                variant="dream" 
                size="lg" 
                onClick={handleSearch}
                disabled={isSearching}
                className="h-14 px-8"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
               )}
             </div>
          </motion.div>

           {/* Summarizer Section */}
           {mainSection === "summarize" && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-4xl mx-auto"
             >
               <TextSummarizer />
             </motion.div>
           )}
 
          {/* Results */}
           {mainSection === "search" && (
           <>
          <AnimatePresence mode="wait">
            {isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center gap-3 glass-card px-6 py-4 rounded-2xl">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-lg">DreamSphere AI is searching...</span>
                </div>
              </motion.div>
            )}

            {results && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Tabs Navigation */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                   <TabsList className="w-full max-w-4xl mx-auto grid grid-cols-7 h-14 glass-card">
                    <TabsTrigger value="summary" className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">Summary</span>
                    </TabsTrigger>
                    <TabsTrigger value="google" className="gap-2">
                      <Globe className="w-4 h-4" />
                      <span className="hidden sm:inline">Web</span>
                    </TabsTrigger>
                    <TabsTrigger value="youtube" className="gap-2">
                      <Youtube className="w-4 h-4" />
                      <span className="hidden sm:inline">YouTube</span>
                    </TabsTrigger>
                    <TabsTrigger value="twitter" className="gap-2">
                      <Twitter className="w-4 h-4" />
                      <span className="hidden sm:inline">Twitter</span>
                    </TabsTrigger>
                    <TabsTrigger value="instagram" className="gap-2">
                      <Instagram className="w-4 h-4" />
                      <span className="hidden sm:inline">Reels</span>
                    </TabsTrigger>
                    <TabsTrigger value="shorts" className="gap-2">
                      <Play className="w-4 h-4" />
                      <span className="hidden sm:inline">Shorts</span>
                    </TabsTrigger>
                     <TabsTrigger value="linkedin" className="gap-2">
                       <Linkedin className="w-4 h-4" />
                       <span className="hidden sm:inline">LinkedIn</span>
                     </TabsTrigger>
                  </TabsList>

                  {/* AI Summary Tab */}
                  <TabsContent value="summary" className="mt-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Overview */}
                      <Card className="glass-card border-white/10">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            AI Overview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {results.summary.overview}
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <Smile className="w-4 h-4 text-accent" />
                            <Badge variant="secondary">{results.summary.emotionalTone}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Key Insights */}
                      <Card className="glass-card border-white/10">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-accent" />
                            Key Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {results.summary.keyInsights.map((insight, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                <span className="text-muted-foreground">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Actionable Tips */}
                      <Card className="glass-card border-primary/20 md:col-span-2">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Actionable Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid sm:grid-cols-3 gap-4">
                            {results.summary.actionableTips.map((tip, i) => (
                              <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <ComingSoonNotice />
                  </TabsContent>

                  {/* Web Tab */}
<TabsContent value="google" className="mt-8">
  <div className="space-y-4 max-w-3xl mx-auto">

    {webLive.map((item, i) => (
      <motion.div
        key={i}
        onClick={() => window.open(item.url, "_blank")}
        className="glass-card p-4 rounded-xl border border-white/10 hover:border-primary/30 transition-colors cursor-pointer group"
      >
        <p className="text-sm text-primary mb-1">{item.source}</p>
        <h3 className="text-lg font-semibold group-hover:text-primary">
          {item.title}
        </h3>
        <p className="text-muted-foreground mt-1 line-clamp-2">
          {item.snippet}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {item.url}
        </p>
      </motion.div>
    ))}

    {webLive.length === 0 && (
      <p className="text-center text-muted-foreground py-6">
        No web results found.
      </p>
    )}

  </div>
</TabsContent>


                  {/* YouTube Tab */}
                  <TabsContent value="youtube" className="mt-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {youtubeLive.map((video, i) => (

  <motion.a
    key={i}
    href={video.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: i * 0.1 }}
    className="glass-card rounded-xl border border-white/10 overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors block"
  >

                         <div className="aspect-video relative overflow-hidden">
  <img
    src={video.thumbnail}
    alt={video.title}
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
    <Play className="w-12 h-12 text-white drop-shadow-lg" />
  </div>

  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
    {video.duration}
  </span>
</div>

                          <div className="p-4">
                            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2">{video.channelName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{video.views}</span>
                              <span>•</span>
                              <span>{video.publishedAt}</span>
                            </div>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                    <ComingSoonNotice />
                  </TabsContent>

                    


                 {/* Twitter Tab */}
<TabsContent value="twitter" className="mt-8">
  <div className="space-y-4 max-w-2xl mx-auto">
    {results.twitter.map((tweet, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        onClick={() => openTwitterSearch(query)}
        className="glass-card p-4 rounded-xl border border-white/10 cursor-pointer hover:border-sky-400/40 transition-colors group"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold">
            {tweet.displayName[0]}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold group-hover:text-sky-400 transition-colors">
                {tweet.displayName}
              </span>

              {tweet.verified && (
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
              )}

              <span className="text-muted-foreground text-sm">
                @{tweet.username}
              </span>

              <span className="text-muted-foreground text-sm">
                • {tweet.time}
              </span>
            </div>

            <p className="mt-2 text-muted-foreground">
              {tweet.content}
            </p>

            <div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                ❤️ {tweet.likes.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                🔁 {tweet.retweets.toLocaleString()}
              </span>
              <span className="text-sky-400 text-xs">
                View on Twitter →
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</TabsContent>


                  {/* Instagram Reels Tab */}
<TabsContent value="instagram" className="mt-8">
  <div className="space-y-6 max-w-3xl mx-auto">

    {/* Reels Search */}
    <motion.div
      onClick={() => openInstagramSearch(query)}
      className="glass-card p-5 rounded-xl border border-white/10 cursor-pointer hover:border-pink-500/40 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
          ▶
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg group-hover:text-pink-400">
            Instagram Reels
          </h3>
          <p className="text-muted-foreground text-sm">
            Watch trending reels related to "{query}"
          </p>
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-pink-400" />
      </div>
    </motion.div>

    {/* Hashtag */}
    <motion.div
      onClick={() => openInstagramHashtag(query)}
      className="glass-card p-5 rounded-xl border border-white/10 cursor-pointer hover:border-orange-500/40 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
          #
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg group-hover:text-orange-400">
            Hashtag Reels
          </h3>
          <p className="text-muted-foreground text-sm">
            Explore reels under #{query.replace(/\s+/g, "")}
          </p>
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-orange-400" />
      </div>
    </motion.div>

    {/* Profile */}
    <motion.div
      onClick={() => openInstagramProfile(query)}
      className="glass-card p-5 rounded-xl border border-white/10 cursor-pointer hover:border-purple-500/40 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
          @
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg group-hover:text-purple-400">
            Instagram Profile
          </h3>
          <p className="text-muted-foreground text-sm">
            Open Instagram profile related to "{query}"
          </p>
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-purple-400" />
      </div>
    </motion.div>

  </div>
</TabsContent>

                 {/* YouTube Shorts Tab */}
<TabsContent value="shorts" className="mt-8">
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {shortsLive.map((short, i) => (

      <motion.a
        key={i}
        href={short.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
        className="aspect-[9/16] rounded-xl overflow-hidden relative group cursor-pointer block"
      >
        {/* REAL SHORTS THUMBNAIL */}
        <img
          src={short.thumbnail}
          alt={short.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-sm font-medium line-clamp-2">
            {short.title}
          </p>
          <p className="text-white/80 text-xs mt-1">
            {short.channelName}
          </p>
        </div>

      </motion.a>
    ))}
  </div>
</TabsContent>

                   {/* LinkedIn Tab */}
<TabsContent value="linkedin" className="mt-8">
  <div className="space-y-6 max-w-3xl mx-auto">

    {/* People */}
    <motion.div
      onClick={() => openLinkedInPeople(query)}
      className="glass-card p-5 rounded-xl border border-white/10 cursor-pointer hover:border-blue-500/40 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
          in
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg group-hover:text-blue-400">
            People on LinkedIn
          </h3>
          <p className="text-muted-foreground text-sm">
            View professionals, creators, and profiles related to "{query}"
          </p>
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-blue-400" />
      </div>
    </motion.div>

    {/* Jobs */}
    <motion.div
      onClick={() => openLinkedInJobs(query)}
      className="glass-card p-5 rounded-xl border border-white/10 cursor-pointer hover:border-green-500/40 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl">
          💼
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg group-hover:text-green-400">
            Jobs on LinkedIn
          </h3>
          <p className="text-muted-foreground text-sm">
            Find real-time jobs and hiring opportunities for "{query}"
          </p>
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-green-400" />
      </div>
    </motion.div>

    {/* Posts */}
    <motion.div
      onClick={() => openLinkedInPosts(query)}
      className="glass-card p-5 rounded-xl border border-white/10 cursor-pointer hover:border-purple-500/40 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
          📝
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg group-hover:text-purple-400">
            Posts & Articles
          </h3>
          <p className="text-muted-foreground text-sm">
            View live posts, articles, and discussions about "{query}"
          </p>
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-purple-400" />
      </div>
    </motion.div>

  </div>
</TabsContent>

                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!results && !isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-3">Start Your Search</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter any topic above and let DreamSphere AI curate personalized results from across the web
              </p>
            </motion.div>
          )}
           </>
           )}
        </div>
      </main>
    </div>
  );
};

const ComingSoonNotice = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-8 text-center"
  >
    {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-white/10">
      <Clock className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        Live API integration coming soon. Currently powered by DreamSphere AI.
      </span>
    </div> */}
  </motion.div>
);

export default Explore;
