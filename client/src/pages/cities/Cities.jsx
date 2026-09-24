import { useEffect, useState, useRef } from "react";
import useFetch from "../../hooks/useFetch";
import { getAllCities } from "../../services/cityServices";
// Import components
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import CityCard from "../../components/cards/CityCard";
import { StateMessage } from "../../components/common/StateMessage";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

// Imports from Chakra UI and Icons
import { 
    CloseButton,
    Badge,
    Box, 
    Flex,
    Heading,
    Input,
    SimpleGrid,
    Text,
    Tabs,
    InputGroup
} from "@chakra-ui/react";

import { AlertCircle, Castle, Earth, MapPinOff, MountainSnow, Pyramid, Search, TreePalm, WavesHorizontal } from "lucide-react";

function Cities() {
    const cities = useFetch(() => getAllCities());

    useEffect(() => {
        cities.execute();
    }, [])

    const inputRef = useRef(null);

    // Logic for filters
    // Search Filter
    const [searchTerm, setSearchTerm] = useState('');

    const handleClearSearch = () => {
        setSearchTerm('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const endElement = searchTerm ? (
        <CloseButton
            size="xs"
            onClick={handleClearSearch}
            me="-2"
        >

        </CloseButton>
    ) : undefined

    // Continent Filter
    const [ continentFilter, setContinentFilter ] = useState('all');

    const filteredCities = cities.data?.filter(city => {
        const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesContinent = continentFilter === 'all' || city.continent === continentFilter;
        return matchesSearch && matchesContinent;
    })

    return (
        <Box>
            <Header />

            <Box 
                as="main"
                mx="auto"
                minH="90vh"
                maxW={{
                    base: "100%",
                    lg: "900px",
                    xl: "1200px"
                }}
                textAlign="center"
                my={10}
            >
                <Heading as="h1">Discover Your Next Destination</Heading>
                <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    px={2}
                >
                    Browse iconic cities worldwide, filter by continent, or search for your next getaway.
                </Text>

                <Flex
                    w="full"
                    maxW={{ base: '90%', lg: "900px", xl: '1200px'}}
                    mt="2"
                    mx="auto"
                    bg="white"
                    p={1.5}
                    pl={6}
                    borderRadius="full"
                    align="center"
                    borderWidth="1px"
                    borderColor="gray.200"
                    boxShadow="sm"
                    transition="all 0.2s"
                    _focusWithin={{
                        boxShadow: "md",
                        borderColor: "amber.400",
                    }}
                >
                    <InputGroup
                        startElement={<Search />}
                        endElement={endElement}
                        color="ink"
                    >
                        <Input 
                            ref={inputRef}
                            variant="unstyled"
                            placeholder="Search City..."
                            _placeholder={{ color: 'gray.500' }}
                            fontSize="md"
                            flex={1}
                            color="ink.900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        />
                    </InputGroup>
                    <Badge
                        bg="amber.400"
                        color="ink.900"
                        borderRadius="full"
                        px={8}
                        py={4}
                        mx={2}
                        fontWeight='semibold'
                    >
                        Find Destinations
                    </Badge>
                </Flex>

                    <Tabs.Root
                        value={continentFilter}
                        onValueChange={(details) => setContinentFilter(details.value)}
                        variant='plain'
                        w="full"
                        maxW="100%"
                        css={{
                            "--tabs-indicator-bg": "colors.gray.subtle",
                            "--tabs-indicator-shadow": "shadows.xs",
                            "--tabs-trigger-radius": "radii.full" 
                        }}
                        mt={4}
                        mb={6}
                    >
                        <Tabs.List
                            variant={{ base: 'enclosed'}}
                            w="full"
                            maxW="100%"
                            overflowX="auto"
                            whiteSpace="nowrap"
                            px={4}
                            css={{
                                "&::-webkit-scrollbar": { display: "none" },
                                msOverflowStyle: "none",
                                scrollbarWidth: "none",
                            }}
                        >
                            <Tabs.Trigger value="all" flexShrink={0}>
                                <Earth />
                                All
                            </Tabs.Trigger>
                            <Tabs.Trigger value="Africa" flexShrink={0}>
                                <Pyramid />
                                Africa
                            </Tabs.Trigger>
                            <Tabs.Trigger value="America" flexShrink={0}>
                                <TreePalm />
                                America
                            </Tabs.Trigger>
                            <Tabs.Trigger value="Asia" flexShrink={0}>
                                <MountainSnow />
                                Asia
                            </Tabs.Trigger>
                            <Tabs.Trigger value="Europe" flexShrink={0}>
                                <Castle />
                                Europe
                            </Tabs.Trigger>
                            <Tabs.Trigger value="Oceania" flexShrink={0}>
                                <WavesHorizontal />
                                Oceania
                            </Tabs.Trigger>
                            <Tabs.Indicator /> 
                        </Tabs.List>
                    </Tabs.Root>

                    {cities.loadingFetch && <LoadingSpinner message="Loading Cities..." />}
                    {cities.fetchError && (
                        <StateMessage 
                                title="Unable to load cities"
                                description="We couldn't retrieve the destinations at this moment. Please check your network connection and try again."
                                icon={<AlertCircle size={24}/>}
                                colorPalette="red"
                        />
                    )}

                    {!cities.loadingFetch && !cities.fetchError && (
                        filteredCities.length === 0 ? (
                            <StateMessage 
                                title="No destinations found"
                                description="We couldn't find any cities matching your criteria. Try adjusting your search term or selecting different continent."
                                icon={<MapPinOff size={24}/>}
                                colorPalette="gray"
                            />
                        ) : (
                            <SimpleGrid
                                columns={{ base: 1, md: 2, lg: 3 }}
                                gap={6}
                                w="full"
                                mx="auto"
                                px={4}
                            >
                                {filteredCities.map((city) => (
                                    <CityCard 
                                        key={city._id} 
                                        city={city} 
                                        onDeleted={(cityId) => cities.setData(prev => prev.filter(city => city._id !== cityId))}
                                    />
                                ))}
                            </SimpleGrid>
                        )
                    )}
            </Box>

            <Footer />
        </Box>
    ) 
}

export default Cities;