import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router";
import CreateCity from "../../components/forms/CreateCity";
import CreateItinerary from "../../components/forms/CreateItinerary";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { 
    Box, 
    Heading,
    Tabs,
    Text,
    VStack
} from "@chakra-ui/react";
import { SwatchBook, Building } from "lucide-react";


function AdminDashboard() {

    const { user } = useAuth();
    
    if (user?.role !== 'admin') {
        return <Navigate to="/" replace/>
    }

    return (
        <Box>
            <Header />

            <VStack
                maxW={{ base: '100%', lg: '900px', xl: '1200px'}}
                minH="80vh"
                my={10}
                mx="auto"
            >
                <Tabs.Root 
                    defaultValue="itineraries"
                    w="full"
                    mx="auto"
                >
                    <Heading as="h1" mb={4} textAlign="center">Admin Dashboard</Heading>
                    <Tabs.List justifyContent="center">
                        <Tabs.Trigger value="itineraries">
                            <SwatchBook />
                            Create Itineraries
                        </Tabs.Trigger>
                        <Tabs.Trigger value="cities">
                            <Building />
                            Create Cities
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="itineraries">
                        <VStack mb={2}>
                            <Heading as="h2">Add new itinerary</Heading>
                            <Text px={6} textAlign='center'>
                                Publish a curated travel route linked to an existing city
                            </Text>
                        </VStack>
                        <CreateItinerary />
                    </Tabs.Content>
                    <Tabs.Content value="cities">
                        <VStack mb={2} mt={2}>
                            <Heading as="h2">Add new city</Heading>
                            <Text px={6} textAlign="center">
                                Expand the destination library so users can explore new locations.
                            </Text>
                        </VStack>
                        <CreateCity />
                    </Tabs.Content>
                </Tabs.Root>
            </VStack>

            <Footer />
        </Box>
    )
}

export default AdminDashboard;