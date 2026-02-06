-- Create search_history table for AI Super Search Hub
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  mood TEXT,
  ai_summary JSONB,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own search history"
ON public.search_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own search history"
ON public.search_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history"
ON public.search_history FOR DELETE
USING (auth.uid() = user_id);

-- Allow anonymous searches (stored without user_id)
CREATE POLICY "Anyone can create anonymous searches"
ON public.search_history FOR INSERT
WITH CHECK (user_id IS NULL);

-- Create index for faster queries
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_search_history_created_at ON public.search_history(created_at DESC);