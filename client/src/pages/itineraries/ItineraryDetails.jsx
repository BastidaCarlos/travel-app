import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import useFetch from "../../hooks/useFetch";
import { getItineraryDetails } from "../../services/itineraryService";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../../hooks/useAuth";
// Import Components
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { ShareBtn } from "../../components/common/ShareBtn";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { StateMessage } from "../../components/common/StateMessage";
import { 
    Avatar,
    Badge,
    Blockquote,
    Box,
    Circle,
    Heading,
    HStack,
    IconButton,
    Image,
    Text,
    VStack
} from "@chakra-ui/react";
import { AlertCircle, ArrowLeft, Clock, Heart, MapPin, Wallet } from "lucide-react";
import Logo from "../../assets/Logo.svg"
import { toaster } from "../../components/ui/toaster";

function ItineraryDetails() {
    const { user } = useAuth();
    const { itineraryId } = useParams();
    const itinerary = useFetch(() => getItineraryDetails(itineraryId), itineraryId);
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite, localError } = useFavorites();

    const isFav = (itinerary.data?._id && isFavorite) 
        ? isFavorite(itinerary.data._id)
        : false;

    useEffect(() => {
        itinerary.execute();
    }, [itineraryId])

    useEffect(() => {
        if (localError) {
            toaster.create({
                title: "Error",
                description: "Error adding to favorites",
                type: "error"
            })
        }
    }, [localError])

    const formatDuration = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours === 0) {
           return `${minutes} min` 
        }

        if (minutes === 0) {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
        }

        return `${hours} h ${minutes} min`
    }

    return (
        <Box>

            <Header />

            {itinerary.loadingFetch && <LoadingSpinner message="Loading Itinerary.." />}
            {itinerary.fetchError && (
                <StateMessage 
                    title="Error Loading Itinerary"
                    description="An error occurred"
                    icon={<AlertCircle />}
                    colorPalette="red"
                />
            )}
            {!itinerary.loadingFetch && !itinerary.fetchError && itinerary.data && (
                <Box
                    as="main"
                    maxW={{
                        base: '100%',
                        lg: '900px',
                        xl: '1200px'
                    }}
                    display="flex"
                    flexDir="column"
                    justifyContent="center"
                    alignItems='center'
                    mx='auto'
                >
                    <Box
                        position="relative"
                        overflow="hidden"
                        borderRadius="md"
                        h={{
                            base: '60vh',
                            lg: '90vh'
                        }}
                        w="100%"
                        maxW={{
                            base: "100%",
                            lg: "900px",
                            xl: "1200px"
                        }}
                    >
                        <IconButton
                            position="absolute"
                            top={4}
                            left={4}
                            zIndex={10}
                            aria-label="Get back to itineraries"
                            variant="ghost"
                            colorPalette="white"
                            onClick={() => {
                                const cityId = itinerary.data?.city?._id;
                                if (cityId) navigate(`/itineraries/${cityId}`);
                            }}
                            _hover={{ bg: 'teal'}}
                        >
                            <ArrowLeft color="white"/>
                        </IconButton>
                        <Image 
                            src={itinerary.data?.city?.image}
                            alt={`${itinerary.data?.city?.name} City`}
                            objectFit="cover"
                            w="full"
                            h="full"
                        />
                        <Box
                            position="absolute"
                            inset={0}
                            bg="blackAlpha.700"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                        >
                            <VStack mx={4}>
                                <Heading as="h1" fontSize={{ base: "xl", lg: "2xl"}} color="white">
                                    {itinerary.data?.title}
                                </Heading>
                                    {itinerary.data?.createdBy ? (
                                        <HStack>
                                            <Avatar.Root>
                                                <Avatar.Fallback name={itinerary.data?.createdBy.name} />
                                                <Avatar.Image src={itinerary.data?.createdBy.avatar} />
                                            </Avatar.Root>
                                            <Link to={`/user/${itinerary.data?.createdBy._id}`}>
                                                <Text color="white">
                                                    {itinerary.data?.createdBy.name}
                                                </Text>
                                            </Link>
                                        </HStack>
                                    ): (
                                        <HStack>
                                            <Avatar.Root>
                                                <Avatar.Fallback name="Adventure Path" />
                                                <Avatar.Image src={Logo} />
                                            </Avatar.Root>
                                            <Text color="white">
                                                Official Path
                                            </Text>
                                        </HStack>
                                    )}
                            </VStack>
                        </Box>
                    </Box>

                    <Box
                        bg="paper.100"
                        borderRadius="2xl"
                        boxShadow="2xl"
                        mt="-2rem"
                        w="90%"
                        position='relative'
                        zIndex={1}
                        px={6}
                        py={8}
                        mb={8}
                    >
                        <HStack
                            justifyContent="space-between"
                            mb={2}
                        >
                            <HStack>
                                <Badge variant="solid" size="lg" bg="ink.700">{itinerary.data?.durationInDays} Days</Badge>
                                <Badge variant="solid" size="lg" bg="ink.700">{`$${itinerary.data?.priceTotal} - USD`}</Badge>
                            </HStack>
                            <HStack>
                                {user && (
                                    <IconButton
                                        onClick={async () => {
                                            if (toggleFavorite) await toggleFavorite(itineraryId)
                                        }}
                                        variant="ghost"
                                        aria-label="Toggle Favorite"
                                    >
                                        <Heart 
                                            fill={isFav ? 'red' : 'none'}
                                            color={isFav ? 'red' : 'currentColor'}
                                        />
                                    </IconButton>

                                    )}
                                <ShareBtn />
                            </HStack>
                        </HStack>
                        <VStack>
                            <Blockquote.Root colorPalette="red">
                                <Blockquote.Content>
                                    {itinerary.data?.description}
                                </Blockquote.Content>
                            </Blockquote.Root>
                        </VStack>

                        <VStack
                            gap={0}
                            align="stretch"
                            mt={9}
                            w="full"
                        >
                            {itinerary.data?.activities?.map((activity, index) => {
                                const isLast = index === itinerary.data?.activities.length -1;
                                const number = String(index + 1).padStart(2, '0');

                                return (
                                    <HStack key={activity._id || index} align="stretch" gap={6}>
                                        <VStack align="center" gap={0}>
                                            <Circle size="40px" bg="amber.500" color="ink.800" fontWeight="bold" fontSize="sm">
                                                {number}
                                            </Circle>
                                            {!isLast && (
                                                <Box w="2px" flex="1" bg="ink.600" my={2} />
                                            )}
                                        </VStack>

                                        <VStack
                                            align="flex-start"
                                            gap={1}
                                            pb={isLast ? 0 : 8}
                                            flex={1}
                                        >
                                            <Heading size="md" textTransform="uppercase">
                                                {activity.title}
                                            </Heading>
                                            <HStack gap={2} wrap="wrap" my={1}>
                                                {activity.durationInMinutes && (
                                                    <Badge
                                                        variant="subtle"
                                                        size="md"
                                                        bg="teal.100"
                                                        color="ink.700"
                                                        boxShadow="sm"
                                                    >
                                                        <HStack gap={1}>
                                                            <Clock size={12} />
                                                            <Text as="span">{formatDuration(activity.durationInMinutes)}</Text>
                                                        </HStack>
                                                    </Badge>
                                                )}

                                                {activity.cost !== undefined && (
                                                    <Badge
                                                        variant="subtle"
                                                        size="md"
                                                        boxShadow="sm"
                                                        bg={activity.cost === 0 ? "green" : "teal.100"}
                                                        color={activity.cost === 0 ? "white" : "ink.800"}
                                                    >
                                                        <HStack gap={1}>
                                                            <Wallet size={12} />
                                                            <Text as="span">
                                                                {activity.cost === 0 ? "Free": `$${activity.cost} USD`}
                                                            </Text>
                                                        </HStack>
                                                    </Badge>
                                                )}
                                            </HStack>

                                            {activity.description && (
                                                <Text color="gray.600" fontSize="sm">
                                                    {activity.description}
                                                </Text>
                                            )}

                                            {activity.location && (
                                                <HStack gap={1} color="gray.500" fontSize="xs" mt={1}>
                                                    <MapPin size={12} />
                                                    <Text as="span">{activity.location}</Text>
                                                </HStack>
                                            )}
                                        </VStack>
                                    </HStack>
                                )
                            })}
                        </VStack>
                    </Box>
                </Box>

            )}

            <Footer />
        </Box>
    )
}

export default ItineraryDetails;