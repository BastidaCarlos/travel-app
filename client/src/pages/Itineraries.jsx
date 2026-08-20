import { useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
// Imports from Chakra UI and Icons
import { 
    Box, 
    VStack,
    Spinner,
    Text,
    Alert,
    Grid,
    Heading,
    Card,
    HStack,
    Badge,
    Slider,
    Portal,
    Select,
    createListCollection,
    Button
} from "@chakra-ui/react";
import { FolderX } from "lucide-react";


// Create collection for duration filter
const durationsCollection = createListCollection({
    items: [
        { label: 'All', value: 'all'},
        { label: '3 - 5 Days', value: '3-5'},
        { label: '7 - 9 Days', value: '7-9'},
        { label: 'More than 9 Days', value: '9+'},
    ],
})

function Itineraries() {
    const { cityId } = useParams();
    const { cities, itineraries, itinerariesIsLoading, itinerariesError, fetchItineraries } = useContext(AppContext);

    useEffect(() => {
        fetchItineraries(cityId);
    }, [cityId]);

    // Retrieving cities to display in the title 
    const currentCity = cities?.find(city => city._id === cityId);
    const cityName = currentCity ? currentCity.name : "City";

    // Logic for filters
    const [maxAvailablePrice, setMaxAvailablePrice] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 0]);

    // useEffect to get the highest price
    useEffect(() => {
        if (itineraries && itineraries.length > 0) {
            const highestPrice = Math.max(...itineraries.map(itinerary => itinerary.price))

            setMaxAvailablePrice(highestPrice);
            setPriceRange([0, highestPrice]);
        }
    }, [itineraries])

    // Filter for duration days
    const [durationFilter, setDurationFilter] = useState('all');

    const filterDuration = (duration, filterValue) => {
        switch (filterValue) {
            case '3-5':
                return duration >= 3 && duration <= 5;
            case '7-9':
                return duration >= 7 && duration <= 9;
            case '9+':
                return duration > 9;
            case 'all':
            default:
                return true;
        }
    }

    // Filtered variables 
    const filteredItineraries = itineraries.filter(itinerary => {
        return (
            itinerary.price >= priceRange[0] &&
            itinerary.price <= priceRange[1] && 
            filterDuration(itinerary.duration, durationFilter)
        );
    })

    // Verify active filters
    const activeFilters = 
        durationFilter !== 'all' ||
        (priceRange[0] !== 0 || priceRange[1] !== maxAvailablePrice);

    // Clean filters function
    const handleCleanFilters = () => {
        setDurationFilter('all');
        setPriceRange([0, maxAvailablePrice]);
    }


    return(
        <Box>
            <Header />

            <Box
                as="main"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
                minH="100vh"
                maxW={{
                    base: '400px',
                    lg: '900px',
                    xl: '1200px'
                }}
                mx="auto"
                py={10}
                px={4}
            >
                <Heading
                    as="h1"
                    fontSize="2xl"
                    fontWeight="bold"
                >
                  {cityName} Itineraries
                </Heading>

                {/* Filters */}
                <HStack 
                    width="100%"
                    maxW={{
                        base: '400px',
                        lg: '900px'
                    }}
                    justify="flex-start"
                    mx="auto"
                >
                    {maxAvailablePrice > 0 && (
                        <Slider.Root
                            value={priceRange}
                            onValueChange={(details) => setPriceRange(details.value)}
                            min={0}
                            max={maxAvailablePrice}
                            minStepsBetweenThumbs={8}
                            step={1}
                            maxW={{ base: '80%', md: '400px'}}
                        >
                            <VStack
                                align="stretch"
                                width="100%"
                                gap={2}
                            >
                                <HStack
                                    justify="space-between"
                                    width="100%"
                                >
                                    <Slider.Label fontSize="sm" fontWeight="medium">
                                        Price Range
                                    </Slider.Label>
                                    <Badge colorPalette="teal">
                                        ${priceRange[0]} USD - ${priceRange[1]} USD
                                    </Badge>
                                </HStack>

                                <Slider.Control>
                                    <Slider.Track>
                                        <Slider.Range bg="teal" />
                                    </Slider.Track>
                                    <Slider.Thumb index={0} />
                                    <Slider.Thumb index={1} />
                                </Slider.Control>
                            </VStack>
                        </Slider.Root>
                    )}

                    <Select.Root
                        collection={durationsCollection}
                        value={[durationFilter]}
                        onValueChange={(details) => setDurationFilter(details.value[0])}
                        maxW={{ base: '100%', md: '300px' }}
                    >
                        <VStack align="stretch" width="100%" gap={2}>
                            <Select.Label fontSize="sm" fontWeight="medium">
                                Duration
                            </Select.Label>
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select duration" /> 
                                </Select.Trigger>

                                <Select.Content>
                                    {durationsCollection.items.map((item) => (
                                        <Select.Item item={item} key={item.value}>
                                            {item.label}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Control>
                        </VStack>
                    </Select.Root>

                    {activeFilters && (
                        <Button
                            variant="otuline"
                            colorPalette="red"
                            height="40px"
                            onClick={handleCleanFilters}
                            visibility={activeFilters ? "visible" : "hidden"}
                        >
                            Clear Filters
                        </Button>
                    )}
                </HStack>

                {/* Errors and loadings states */}
                {itinerariesIsLoading && (
                    <VStack>
                        <Spinner 
                            size="xl"
                            color="fg.emphasized"
                        /> 
                        <Text size="xl" color="fg.emphasized" fontWeight="bold">Loading Itineraries...</Text>
                    </VStack>
                )}

                {itinerariesError && (
                    <Box my={4} width="100%" maxW="sm" px={4}>
                        <Alert.Root 
                            status="error" 
                            variant="subtle" 
                            p={6}
                            radius="md"
                        >
                            <VStack
                                width="100%"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                spaceY={2}
                            >
                                <Alert.Indicator />
                                <Alert.Title mt={4} fontSize="xl" fontWeight="bold">
                                    Error connection
                                </Alert.Title>
                                <Alert.Description maxWidth="sm">
                                    {itinerariesError}
                                </Alert.Description>
                            </VStack>
                        </Alert.Root>
                    </Box>
                )}

                {!itinerariesIsLoading && !itinerariesError && itineraries.length === 0 && (
                    <Box my={4} width="100%" maxW="sm" px={4}>
                        <Alert.Root status="info" title="No itineraries available yet">
                            <FolderX />
                            <Alert.Title fontSize="xl">No itineraries available yet</Alert.Title>
                        </Alert.Root>
                    </Box>
                )}

                {/* Handle states for filters */}
                {!itinerariesIsLoading && !itinerariesError && itineraries.length > 0 && filteredItineraries.length === 0 && (
                    <Box my={4} width="100%" maxW="sm" px={4}>
                        <Alert.Root status="info" title="There are no matching itineraries">
                            <FolderX />
                            <Alert.Title fontSize="xl">Ther are no matching itineraries</Alert.Title>
                        </Alert.Root>
                    </Box>
                )}

                <Grid
                    templateColumns={{ 
                        base: "1fr",
                        md: "repeat(2, minmax(300px, 1fr))",
                        lg: "repeat(3, minmax(300px, 1fr))"
                    }}
                    gap={4}
                    px={8}
                    mt={4}
                    maxW="900px"
                >
                    {filteredItineraries.map((itinerary) => (
                        <Card.Root
                            key={itinerary._id}
                            as="article"
                        >
                            <Card.Body>
                                <HStack justify="flex-end">
                                    <Badge>{itinerary.price}</Badge>
                                    <Badge>{itinerary.duration}</Badge>
                                </HStack>
                                <Card.Title mt={2}>{itinerary.title}</Card.Title>
                                <Card.Description>{itinerary.description}</Card.Description>
                            </Card.Body>
                        </Card.Root>
                    ))}

                </Grid>

            </Box>

            <Footer />
        </Box>
    )
    
}

export default Itineraries;