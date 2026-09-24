import { useEffect } from "react";
import { useParams } from "react-router";
import useFetch from "../../hooks/useFetch";
import { getItineraryDetails } from "../../services/itineraryService";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { StateMessage } from "../../components/common/StateMessage";
import CreateItinerary from "../../components/forms/CreateItinerary";
import { Box, Heading, VStack } from "@chakra-ui/react";
import { AlertCircle } from "lucide-react";

function EditItineraryPage() {
    const { itineraryId } = useParams();
    const itinerary = useFetch(() => getItineraryDetails(itineraryId), itineraryId)

    useEffect(() => {
        if (itineraryId) {
            itinerary.execute();
        }
    }, [itineraryId])
    
    const hasData = itinerary.data && !Array.isArray(itinerary.data);

    return (
        <Box>
            <Header />
            <VStack
                py={10}
                minH="80vh"
            >
                <Heading as="h1">Edit Itinerary</Heading>
                {itinerary.loadingFetch && <LoadingSpinner message="Loading data..." />}
                {itinerary.fetchError && (
                    <StateMessage 
                        title="Error"
                        description="Unable to load the data"
                        icon={<AlertCircle />}
                        colorPalette="red"
                    />
                )}
                {!itinerary.loadingFetch && !itinerary.fetchError && hasData && (
                    <CreateItinerary itineraryId={itineraryId} initialData={itinerary.data} />
                )}
            </VStack>
            <Footer />
        </Box>
    )
}

export default EditItineraryPage; 