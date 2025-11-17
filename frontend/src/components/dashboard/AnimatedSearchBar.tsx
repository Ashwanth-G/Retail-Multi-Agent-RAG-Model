import { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const searchSuggestions = [
  "Find the perfect summer dress...",
  "Show me trending sneakers...",
  "Best deals on electronics...",
  "Recommend eco-friendly products...",
  "Gift ideas for my partner...",
  "Latest tech gadgets...",
];

export const AnimatedSearchBar = () => {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentFullText = searchSuggestions[currentSuggestion];
    const shouldDelete = isDeleting;

    const timeout = setTimeout(
      () => {
        if (!shouldDelete) {
          // Typing
          if (displayText.length < currentFullText.length) {
            setDisplayText(currentFullText.slice(0, displayText.length + 1));
          } else {
            // Finished typing, wait then start deleting
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          // Deleting
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            // Finished deleting, move to next suggestion
            setIsDeleting(false);
            setCurrentSuggestion((prev) => (prev + 1) % searchSuggestions.length);
          }
        }
      },
      shouldDelete ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentSuggestion]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate("/chat");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            
            <div className="flex-1 relative">
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={displayText}
                className="h-14 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Create
                </Button>
              </div>
            </div>
          </div>
          
          <div className="px-6 pb-6 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Popular:</span>
            {["Electronics", "Fashion", "Home & Garden", "Sports"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchValue(tag)}
                className="px-3 py-1 text-xs rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
