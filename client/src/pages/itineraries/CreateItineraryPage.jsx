import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import CreateItinerary from "../../components/forms/CreateItinerary";
import { 
    Box,
    Flex,
    Heading,
    Text
} from "@chakra-ui/react";

function CreateItineraryPage() {
    return (
        <Flex
            direction="column"
            w="full"
        >
            <Header />

            <Box
                flex="1"
                maxW={{ base: '90%', lg: '900px', xl: '1200px'}}
                w="full"
                mx="auto"
                display="flex"
                flexDir='column'
                justifyContent="center"
                alignItems="center"
                py={{ base: 6, md: 10 }}
            >
                <Heading
                    as="h1"
                    fontSize={{ base: 'xl', lg: '2xl'}}
                    mb={2}
                >
                    Create a New Itinerary
                </Heading>
                <Text
                    as="h2"
                    fontSize="lg"
                    maxW="600px"
                    fontStyle="italic"
                    textAlign="center"
                    mb={4}
                >
                    Share your personal travel route, local recommendations, and daily highlights to help fellow travelers explore
                </Text>
                <CreateItinerary />
            </Box>

            <Footer />
        </Flex>
    )
}

export default CreateItineraryPage;