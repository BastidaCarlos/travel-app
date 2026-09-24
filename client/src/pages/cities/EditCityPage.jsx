import { useEffect } from "react";
import { useParams } from "react-router";
import useFetch from "../../hooks/useFetch";
import { getCityById } from "../../services/cityServices";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { StateMessage } from "../../components/common/StateMessage";
import CreateCity from "../../components/forms/CreateCity";
import { Box, Heading, VStack } from "@chakra-ui/react";
import { AlertCircle } from "lucide-react";

function EditCityPage() {
    const { cityId } = useParams();
    const city = useFetch(() => getCityById(cityId), cityId);

    useEffect(() => {
        if (cityId) {
           city.execute() 
        }
    }, [cityId])

    const hasData = city.data && !Array.isArray(city.data);

    return (
        <Box>
            <Header />

            <VStack
                minH="80vh"
                py={8}
            >
                <Heading as="h1">Edit City</Heading>
                {city.loadingFetch && <LoadingSpinner message="Loading Data..." />}
                {city.fetchError && (
                    <StateMessage 
                        title="Error"
                        description="Unable to load the data"
                        icon={<AlertCircle />}
                        colorPalette="red"
                    />
                )}
                {!city.loadingFetch && !city.fetchError && hasData && (
                    <CreateCity cityId={cityId} initialData={city.data} />
                )}
            </VStack>

            <Footer />
        </Box>
    )
}

export default EditCityPage;