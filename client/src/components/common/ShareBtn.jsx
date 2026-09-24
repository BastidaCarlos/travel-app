import { Share2 } from "lucide-react";
import { toaster } from "../ui/toaster";
import { IconButton } from "@chakra-ui/react";

export const ShareBtn = ({ title, description, url }) => {

    const handleShare = async () => {
        const shortDescription = description && description.length > 100
            ? `${description.substring(0, 100)}...`
            : description || "Check this out!";

        const shareData = {
            title: title || "Adventure Paths Itinerary",
            text: shortDescription,
            url: url || window.location.href,
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
           try {
            await navigator.share(shareData);
            toaster.create({
                title: "Route Shared",
                description: "The itineray has successfully shared",
                type: "success"
            })
           } catch (error) {
            if (error.name !== 'AbortError') {
                toaster.create({
                    title: "Error while sharing",
                    description: `An error occurred ${error.message}`,
                    type: "error"
                })
            }
           } 
        } else {
            try {
                if (!navigator.clipboard) {
                    throw new Error("Clipboard API not available in this context");
                    
                }
                await navigator.clipboard.writeText(shareData.url);
                toaster.create({
                    title: "URL copied",
                    description: "The url has been copied to clipboard",
                    type: "success" 
                })
            } catch (error) {
                toaster.create({
                    title: "Error",
                    description: `Couldn't copy the URL ${error.message}`,
                    type: "error"
                })
            }
        }
    }
    
    return (
        <IconButton
            aria-label="Share Itinerary"
            variant='ghost'
            onClick={handleShare}
        >
            <Share2 />
        </IconButton>
    )
}