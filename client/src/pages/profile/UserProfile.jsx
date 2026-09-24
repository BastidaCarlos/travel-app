import { useEffect } from "react";
import { useParams } from "react-router";
import useFetch from "../../hooks/useFetch";
import { getPublicProfile } from "../../services/userService";
// Import components
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import ItineraryCard from "../../components/cards/ItineraryCard";
import { StateMessage } from "../../components/common/StateMessage";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { 
    Avatar,
    Badge,
    Blockquote,
    Box,
    Flex,
    Heading,
    HStack,
    SimpleGrid,
    VStack
} from "@chakra-ui/react";
import { AlertCircle } from "lucide-react";

function UserProfile() {
    const { userId } = useParams();
    const profile = useFetch(() => getPublicProfile(userId), userId);

    useEffect(() => {
        if (userId) {
            profile.execute()
        }
    }, [userId]);

    return (
        <Box>

            <Header />

            <Box
                as="main"
                minH="90vh"
                mx="auto"
                maxW={{
                    base: "100%",
                    lg: "900px",
                    xl: "1200px"
                }}
                py={10}
            >
                {profile.loadingFetch && <LoadingSpinner message="Loading Profile..." />}
                {profile.fetchError && (
                    <StateMessage 
                        title="Unable to load the Profile"
                        description="An error occurred"
                        icon={<AlertCircle />}
                        colorPalette="red"
                    />
                )}
                <Flex
                    direction={{ base: 'column', md: 'row'}}
                    w="full"
                    mx="auto"
                    my={4}
                    p={6}
                    justifyContent="center"
                    alignItems="center"
                    bg="paper.100"
                    borderRadius="xl"
                    boxShadow="xl"
                    borderColor='paper.300'
                    border="1px dashed"
                >
                    <Avatar.Root boxSize="100px">
                        <Avatar.Fallback name={profile.data?.user?.name} />
                        <Avatar.Image src={profile.data?.user?.avatar} />
                    </Avatar.Root>
                    <VStack
                        alignItems={{ base: 'center', md: 'flex-start' }}
                        textAlign={{ base: 'center', md: "left"}}
                        ml={{ md: "8"}}
                    >
                        <Heading as="h1">
                            {profile.data?.user?.name}
                        </Heading>
                        <Badge>
                            {profile.data?.user?.rol !== 'admin' && 'TRAVELER PROFILE'}
                        </Badge>
                        <Blockquote.Root
                            mt={2}
                            colorPalette="teal"
                        >
                            <Blockquote.Content>
                                {profile.data?.user?.bio || "This traveler hasn't shared their story yet."}
                            </Blockquote.Content>
                        </Blockquote.Root>
                    </VStack>
                </Flex>
                <VStack 
                    gap={0}
                    mt={6}
                >
                    <Heading as="h2">
                        Itineraries
                    </Heading>
                    <Badge>
                        Created {profile.data?.itineraries?.length}
                    </Badge>
                </VStack>
                <SimpleGrid
                    mt={6}
                    column={{ base: 1, md: 2, lg: 3 }}
                    gap={4}
                    w="90%"
                    mx="auto"
                >
                    {profile.data?.itineraries?.map(itinerary => (
                        <ItineraryCard key={itinerary._id} itinerary={itinerary} />
                    ))}
                </SimpleGrid>
            </Box>

            <Footer />
        </Box>
    )

}

export default UserProfile;