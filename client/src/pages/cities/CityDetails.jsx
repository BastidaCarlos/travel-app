import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getCityById } from "../../services/cityServices";
import { getItinerariesByCity } from "../../services/itineraryService";
// Import components
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { StateMessage } from "../../components/common/StateMessage";
import ItineraryCard from "../../components/cards/ItineraryCard";

// Imports from Chakra UI and Icons
import { 
    Badge,
    Box, 
    Button,
    createListCollection,
    Flex,
    Grid,
    Heading,
    HStack,
    Image,
    Portal,
    Select,
    Slider,
    Text,
    VStack
} from "@chakra-ui/react";
import { BookDashed, AlertCircle } from "lucide-react";


// Create collection for duration filter
const durationsCollection = createListCollection({
    items: [
        { label: 'All', value: 'all'},
        { label: '3 - 5 Days', value: '3-5'},
        { label: '7 - 9 Days', value: '7-9'},
        { label: 'More than 9 Days', value: '9+'},
    ],
})

const authCollection = createListCollection({
    items: [
        { label: 'All Paths', value: 'all' },
        { label: 'Official Paths', value: 'official' },
        { label: 'Community Paths', value: 'community' },
    ]
})

function Itineraries() {
    const { cityId } = useParams();
    const cityDetails = useFetch(() => getCityById(cityId), cityId);
    const cityItineraries = useFetch(() => getItinerariesByCity(cityId), cityId)
    const navigate = useNavigate();

    useEffect(() => {
        cityDetails.execute();
        cityItineraries.execute();
    }, [cityId]);

    // Logic for filters
    const [maxAvailablePrice, setMaxAvailablePrice] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 0]);

    // useEffect to get the highest price
    useEffect(() => {
        if (cityItineraries.data && cityItineraries.data?.length > 0) {
            const highestPrice = Math.max(...cityItineraries.data?.map(itinerary => itinerary.priceTotal))

            setMaxAvailablePrice(highestPrice);
            setPriceRange([0, highestPrice]);
        }
    }, [cityItineraries.data])

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

    // Path type filter
    const [ pathTypeFilter, setPathTypeFilter ] = useState('all');
    
    const typeFilter = (itinerary, filterValue) => {
        if (filterValue === 'all') return true;
        const isCommunity = Boolean(itinerary.createdBy); 
        return filterValue === 'community' ? isCommunity : !isCommunity;
    }

    // Filtered variables 
    const filteredItineraries = cityItineraries.data?.filter(itinerary => {
        return (
            itinerary.priceTotal >= priceRange[0] &&
            itinerary.priceTotal <= priceRange[1] && 
            filterDuration(itinerary.durationInDays, durationFilter) && 
            typeFilter(itinerary, pathTypeFilter)
        );
    })

    // Verify active filters
    const activeFilters = 
        durationFilter !== 'all' ||
        pathTypeFilter !== 'all' ||
        (priceRange[0] !== 0 || priceRange[1] !== maxAvailablePrice);

    // Clean filters function
    const handleCleanFilters = () => {
        setDurationFilter('all');
        setPathTypeFilter('all');
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
                py={10}
                minH="100vh"
                maxW={{
                    base: '350px',
                    lg: '900px',
                    xl: '1200px'
                }}
                mx="auto"
            >
                <Flex
                    direction={{ base: 'column', md: 'row'}}
                    w="full"
                    mx="auto"
                    my={4}
                    bg="paper.100"
                    borderRadius="xl"
                    boxShadow="xl"
                    borderColor='paper.300'
                    justifyContent="center"
                    alignItems="center"
                    border="1px dashed"
                >
                    <VStack
                        textAlign={{ base: 'center', md: 'left'}}
                        p={6}
                        gap={8}
                    >
                        <Heading 
                            as="h1"
                            fontSize="2xl"
                            fontWeight="bold"
                        >
                            Explore {cityDetails.data?.name || "City"}
                        </Heading>
                        <Text>
                            {cityDetails.data?.description || ""} 
                        </Text>
                    </VStack>
                    <Image 
                        src={cityDetails.data?.image}
                        maxH="300px"
                        w={{ base: '100%', md: '50%'}}
                        objectFit="cover"
                        borderRadius="2xl"
                    />
                </Flex>

                <Flex
                    direction={{ base: 'column', lg: 'row'}}
                    align={{ base: 'stretch', lg: 'flex-end'}}
                    justify="space-between"
                    gap={6}
                    mx="auto"
                    mt={4}
                    mb={8}
                    w="full"
                >
                    {maxAvailablePrice > 0 && (
                        <Box flex={{ lg: "1.5" }} w="full">
                            <Slider.Root
                                value={priceRange}
                                onValueChange={(details) => setPriceRange(details.value)}
                                min={0}
                                max={maxAvailablePrice}
                                minStepsBetweenThumbs={10}
                                step={1}
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
                                        <Slider.Label
                                            fontSize="sm"
                                            fontWeight="medium"
                                        >
                                            Budget Range
                                        </Slider.Label>
                                        <Badge
                                            colorPalette="teal"
                                        >
                                            ${priceRange[0]} USD - ${priceRange[1]} USD 
                                        </Badge>
                                    </HStack>
                                    <Slider.Control>
                                        <Slider.Track>
                                            <Slider.Range bg="teal" />
                                        </Slider.Track>
                                        <Slider.Thumb index={0} w="14px" h="14px" />
                                        <Slider.Thumb index={1} w="14px" h="14px"  />
                                    </Slider.Control>
                                </VStack>
                            </Slider.Root>
                        </Box>
                    )}

                    <Box flex={{ lg: "1" }} w="full">
                        <Select.Root
                            collection={durationsCollection}
                            value={[durationFilter]}
                            onValueChange={(details) => setDurationFilter(details.value[0])}
                        >
                            <Select.HiddenSelect />
                            <Select.Label>Duration</Select.Label>
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {durationsCollection.items.map((item) => (
                                            <Select.Item item={item} key={item.value}>
                                                {item.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Box>

                    <Box
                        flex={1}
                        w="full"
                    >
                        <Select.Root
                            collection={authCollection}
                            value={[pathTypeFilter]}
                            onValueChange={(details) => setPathTypeFilter(details.value[0])}
                        >
                            <Select.HiddenSelect />
                            <Select.Label>Path Type</Select.Label>
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select type"/>
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {authCollection.items.map((item) => (
                                            <Select.Item item={item} key={item.value}>
                                                {item.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Box>

                    <Box 
                        pointerEvents={activeFilters ? "auto" : "none"}
                        flex={{ lg: "0.5" }}
                        display="flex"
                        justifyContent='flex-end'
                    >
                        <Button
                            variant="outline"
                            colorPalette="teal"
                            onClick={handleCleanFilters}
                            disabled={!activeFilters}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                </Flex>

                {cityItineraries.loadingFetch && <LoadingSpinner message="Loading Itineraries..." />}
                {cityItineraries.fetchError && (
                    <StateMessage 
                        title="Unable to load itineraries"
                        description={`We couldn't fetch the itineraries for ${cityDetails.data?.name}. Please check your connection and try again`}
                        icon={<AlertCircle />}
                        colorPalette="red"
                    />
                )}
                {!cityItineraries.loadingFetch && !cityItineraries.fetchError && cityItineraries.data?.length === 0 && (
                    <VStack>
                        <StateMessage 
                            title="No itineraries available yet"
                            description={`We're currently crafting itineraries for ${cityDetails.data?.name}. Check back soon!`}
                            icon={<BookDashed />}
                            colorPalette="gray"
                        />
                        <Button
                            onClick={() => navigate('/cities')}
                        >
                            Explore other cities
                        </Button>
                    </VStack>
                )}

                {!cityItineraries.loadingFetch && !cityItineraries.fetchError && cityItineraries.data?.length > 0 && filteredItineraries.length === 0 && (
                    <VStack>
                        <StateMessage 
                            title="No itineraries match your filters"
                            description="Try expanding your budget or changing the selected duration"
                            icon={<BookDashed />}
                            colorPalette="gray"
                        />
                        <Button
                            variant="outline"
                            onClick={handleCleanFilters}
                        >
                            Reset Filters
                        </Button>
                    </VStack>
                )}

                <Grid
                    templateColumns={{
                        base: "1fr",
                        lg: "repeat(2, minmax(300px, 1fr))",
                        xl: "repeat(3, minmax(350px, 1fr))"
                    }}
                    gap={6}
                    w="full"
                >
                    {filteredItineraries.map((itinerary) => (
                        <ItineraryCard 
                            key={itinerary._id} 
                            itinerary={itinerary} 
                            onDeleted={(id) => cityItineraries.setData(prev => prev.filter(it => it._id !== id))}
                        />
                    ))}
                </Grid>
            </Box>

            <Footer />

        </Box>
    )
    
}

export default Itineraries;