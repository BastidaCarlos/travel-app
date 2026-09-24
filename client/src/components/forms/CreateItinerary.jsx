import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../hooks/useAuth";
import { getAllCities } from "../../services/cityServices";
import { createItinerary, createCuratedItinerary, updateItinerary } from "../../services/itineraryService";
import { toaster } from "../ui/toaster";
import { 
    Accordion,
    Alert,
    Badge,
    Box,
    Button,
    createListCollection, 
    Field,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    Portal,
    Select,
    Textarea,
    Text,
    VStack
} from "@chakra-ui/react";
import { AlertCircle, CalendarRange, Clock, Earth, Feather, FilePlusCorner, MapPin, Send, Trash, X } from "lucide-react";

function CreateItinerary({ initialData, itineraryId }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const cities = useFetch(() => getAllCities())
    const [ itineraryData, setItineraryData ] = useState({
        title: '',
        description: '',
        priceTotal: '',
        durationInDays: '',
        city: ''
    })
    const [ activities, setActivities ] = useState([
        {
            title: '',
            description: '',
            durationInMinutes: '',
            cost: '',
            location: ''
        }, 
        {
            title: '',
            description: '',
            durationInMinutes: '',
            cost: '',
            location: ''
        }, 
        {
            title: '',
            description: '',
            durationInMinutes: '',
            cost: '',
            location: ''
        }])

        const [ errorItinerary, setErrorItinerary ] = useState('');
        const [ isSubmitting, setIsSubmitting ] = useState(false);
        const isEditMode = Boolean(itineraryId);
        const navigateTo = isEditMode ? `/itineraries/details/${itineraryId}` : (user?.role === 'admin' ? '/admin/dashboard' : '/profile/me')

        useEffect(() => {
            if (initialData) {
               setItineraryData({
                title: initialData.title,
                description: initialData.description || '',
                priceTotal: String(initialData.priceTotal),
                durationInDays: String(initialData.durationInDays),
                city: initialData.city?._id || initialData.city
               }) 
               setActivities(initialData.activities || [])
            }
        }, [initialData])

        const updateActivity = (index, field, value) => {
            const modifyActivity = activities.map((activity, i) => {
                if (i === index) {
                    return {
                        ...activity,
                        [field]: value
                    }
                }
                return activity
            })
            setActivities(modifyActivity);
        }

        const addActivity = () => {
            setActivities([
                ...activities,
                { 
                    title: '',
                    description: '',
                    durationInMinutes: '',
                    cost: '',
                    location: ''
                }
            ])
        }

        const removeActivity = (index) => {
            setActivities(
                activities.filter((_, i) => index !== i)
            )
        }

        useEffect(() => {
            cities.execute()
        }, [])

        const citiesList = useMemo(() => {
            return createListCollection({
                items: (cities.data || []).map(city => ({
                    label: `${city.name}, ${city.country}`,
                    value: city._id
                }))
            })
        }, [cities.data])

        const selectedContinent = cities.data?.find(c => c._id === itineraryData.city)?.continent

        const handleChange = (e) => {
            const { name, value } = e.target;
            setItineraryData(prev => ({
                ...prev,
                [name]: value
            }))
        }

        const handleCityChange = (details) => {
            const selectedCityId = details.value[0];
            setItineraryData(prev => ({
                ...prev,
                city: selectedCityId
            }));
        };

        const validateForm = () => {
            const requiredFields = [itineraryData.title, itineraryData.description, itineraryData.priceTotal, itineraryData.durationInDays, itineraryData.city]
            const hasEmptyFields = requiredFields.some(field => !field || field.trim() === '');

            const hasEmptyActivities = activities.some(activity => {
                return (
                    !activity.title?.trim() ||
                    !activity.description?.trim() ||
                    !activity.location?.trim()
                );
            });

            if (hasEmptyFields || hasEmptyActivities) {
               setErrorItinerary('All the fields are required') 
               return false;
            }

            setErrorItinerary('');
            return true;
        }

        const handleSubmit = async (e) => {
            e.preventDefault();

            const isValid = validateForm();
            if (!isValid) {
                toaster.create({
                    title: 'Error',
                    description: 'An error occurred',
                    type: 'error',
                })                
                return;
            }

            setIsSubmitting(true);

            try {
                const payload = {
                    ...itineraryData,
                    priceTotal: Number(itineraryData.priceTotal),
                    durationInDays: Number(itineraryData.durationInDays),
                    activities: activities.map(a => ({
                        ...a,
                        durationInMinutes: Number(a.durationInMinutes),
                        cost: Number(a.cost) || 0
                    }))
                };

                if (itineraryId) {
                    await updateItinerary(itineraryId, payload);
                    toaster.create({
                        title: 'Itinerary Updated',
                        description: 'The itinerary was updated correctly',
                        type: 'success',
                    })
                    navigate(`/itineraries/details/${itineraryId}`)
                    return;
                }
                
                const createFn = user.role === 'admin' ? createCuratedItinerary : createItinerary;
                const savedItinerary = await createFn(payload);

                toaster.create({
                    title: 'Itinerary Created',
                    description: 'The itinerary was created correctly',
                    type: 'success',
                })
                navigate(`/itineraries/details/${savedItinerary._id}`)
            } catch (error) {
                toaster.create({
                    title: 'Itinerary Error',
                    description: 'Error Creating the itinerary',
                    type: 'error',
                })
            } finally {
                setIsSubmitting(false);
            }
        }

        return (
            <Box
                w="full"
                maxW={{ base: '90%', lg: '600px', xl: '900px'}}
                bg="teal.700"
                borderRadius="2xl"
                color="white"
                mx="auto"
            >
                <VStack 
                    w="full"
                    p={6}
                    as="form"
                    onSubmit={handleSubmit}
                >
                    <Heading as="h1">
                        {isEditMode ? 'Edit Itinerary' : 'Create Itinerary'}
                    </Heading>

                    <Field.Root
                        w="full"
                        m={6}
                    >
                        <Field.Label fontSize="lg">
                            Title
                        </Field.Label>
                        <InputGroup
                            startElement={<Feather />}
                        >
                            <Input 
                                value={itineraryData.title}
                                name="title"
                                onChange={handleChange}
                                id="title"
                                variant="subtle"
                                placeholder="Itinerary title..."
                                color="black"
                            />
                        </InputGroup>
                    </Field.Root>
                    <HStack
                        w="full"
                    >
                        <Field.Root>
                            <Field.Label fontSize="lg">
                                Duration <Text as="span" fontSize="xs" fontStyle="italic">(In days)</Text>
                            </Field.Label>
                            <InputGroup startElement={<CalendarRange />}>
                                <Input 
                                    value={itineraryData.durationInDays}
                                    name="durationInDays"
                                    onChange={handleChange}
                                    variant="subtle"
                                    type="number"
                                    color="black"
                                    placeholder="00"
                                />
                            </InputGroup>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label fontSize="lg">
                                Price Total 
                            </Field.Label>
                            <InputGroup startElement="$" endElement="USD">
                                <Input 
                                    value={itineraryData.priceTotal}
                                    name="priceTotal"
                                    onChange={handleChange}
                                    placeholder="0.00" 
                                    variant="subtle" 
                                    color="black"
                                />
                            </InputGroup>
                        </Field.Root>
                    </HStack>
                    <Select.Root 
                        value={itineraryData.city ? [itineraryData.city] : []}
                        name="city"
                        onValueChange={handleCityChange}
                        collection={citiesList} 
                        variant="subtle"
                        color="black"
                    >
                        <Select.HiddenSelect />
                        <HStack justify="space-between">
                            <Select.Label color="white">Select City</Select.Label>
                            {selectedContinent && (
                                <Badge>
                                    {selectedContinent}
                                </Badge>
                            )}
                        </HStack>
                        <Select.Control>
                            <Select.Trigger>
                                <HStack gap={2}>
                                    <Earth size={18}/>
                                    <Select.ValueText placeholder="Select City" /> 
                                </HStack>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {citiesList.items.map((city) => (
                                        <Select.Item item={city} key={city.value} color="black">
                                            {city.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Field.Root>
                        <Field.Label fontSize="lg">
                            Description
                        </Field.Label>
                        <Textarea 
                            value={itineraryData.description}
                            name="description"
                            onChange={handleChange}
                            color="black" 
                            placeholder="..." 
                            variant="subtle" 
                            autoresize 
                            maxLength={500}
                        />
                        <Field.HelperText color="white" fontStyle="italic">{itineraryData.description.length} / 500 Characters</Field.HelperText>
                    </Field.Root>

                    <VStack
                        w="full"
                        mt={4}
                    >
                        <Accordion.Root
                            variant="enclosed"
                            bg="teal"
                            collapsible
                        >
                            {activities.map((activity, index) => (
                                <Accordion.Item 
                                    key={index} 
                                    value={`activity-${index}`}
                                    borderColor="teal.600"
                                >
                                    <Accordion.ItemTrigger
                                        px={4}
                                        py={3}
                                        _open={{ bg: 'teal' }}
                                    >
                                        <Text as="span">{activity.title ? activity.title : `Activity ${index + 1}`}</Text>
                                        <Accordion.ItemIndicator />
                                    </Accordion.ItemTrigger>
                                    <Accordion.ItemContent bg="teal.400">
                                        <Accordion.ItemBody>
                                            <VStack>
                                                <Field.Root>
                                                    <Field.Label>
                                                        Title
                                                    </Field.Label>
                                                    <InputGroup
                                                        startElement={<Feather />}
                                                    >
                                                        <Input 
                                                            variant="subtle"
                                                            value={activity.title}
                                                            onChange={(e) => updateActivity(index, 'title', e.target.value)}
                                                            placeholder="Activity Title..."
                                                            color="black"
                                                        />
                                                    </InputGroup>
                                                </Field.Root>
                                                <HStack
                                                    w="full"
                                                >
                                                    <Field.Root>
                                                        <Field.Label>
                                                            Duration <Text as="span" fontSize="xs" fontStyle="italic">(In minutes)</Text>
                                                        </Field.Label>
                                                        <InputGroup startElement={<Clock />}>
                                                            <Input 
                                                                type="number"
                                                                variant="subtle"
                                                                value={activity.durationInMinutes}
                                                                onChange={(e) => updateActivity(index, 'durationInMinutes', e.target.value)}
                                                                color="black"
                                                                placeholder="00"
                                                            />
                                                        </InputGroup>
                                                    </Field.Root>
                                                    <Field.Root>
                                                        <Field.Label>
                                                            Cost
                                                        </Field.Label>
                                                        <InputGroup startElement="$" endElement="USD">
                                                            <Input 
                                                                variant='subtle'
                                                                type="number"
                                                                value={activity.cost}
                                                                onChange={(e) => updateActivity(index, 'cost', e.target.value)}
                                                                color="black"
                                                                placeholder="0.00"
                                                            />
                                                        </InputGroup>
                                                    </Field.Root>
                                                </HStack>
                                                <Field.Root>
                                                    <Field.Label>
                                                        Location
                                                    </Field.Label>
                                                    <InputGroup startElement={<MapPin />}>
                                                        <Input 
                                                            variant="subtle"
                                                            value={activity.location}
                                                            onChange={(e) => updateActivity(index, 'location', e.target.value)}
                                                            color="black"
                                                            placeholder="Location..."
                                                        />
                                                    </InputGroup>
                                                </Field.Root>
                                                <Field.Root>
                                                    <Field.Label>
                                                        Description
                                                    </Field.Label>
                                                    <Textarea 
                                                        variant="subtle"
                                                        value={activity.description}
                                                        onChange={(e) => updateActivity(index, 'description', e.target.value)}
                                                        placeholder="Description ..."
                                                        autoresize
                                                        maxLength={200}
                                                        color="black"
                                                    />
                                                    <Field.HelperText fontStyle="italic" color="white">
                                                        {(activity.description || '').length} / 200 Characters
                                                    </Field.HelperText>
                                                </Field.Root>
                                                <IconButton
                                                    colorPalette="red"
                                                    alignSelf="flex-end"
                                                    size="md"
                                                    onClick={() => removeActivity(index)}
                                                    disabled={activities.length <= 3}
                                                >
                                                    <Trash />
                                                </IconButton>
                                            </VStack>
                                        </Accordion.ItemBody>
                                    </Accordion.ItemContent>
                                </Accordion.Item>
                            ))}
                        </Accordion.Root>
                        <IconButton
                            variant="solid"
                            alignSelf="flex-end"
                            onClick={() => addActivity()}
                        >
                            <FilePlusCorner />
                        </IconButton>
                    </VStack>
                    {errorItinerary && (
                        <Alert.Root status="error">
                            <AlertCircle />
                            <Alert.Content>
                                <Alert.Title>Invalid Fields</Alert.Title>
                                <Alert.Description>
                                    {errorItinerary}
                                </Alert.Description>
                            </Alert.Content>
                        </Alert.Root>
                    )}

                    <HStack>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <Send /> {isEditMode ? 'Update Itinerary' : 'Create Itinerary'}
                        </Button>
                        <Button
                            type="button"
                            colorPalette="red"
                            onClick={() => navigate(navigateTo)}
                            disabled={isSubmitting}
                        >
                            <X /> Cancel
                        </Button>

                    </HStack>
                    
                </VStack>
            </Box>
        )
}

export default CreateItinerary;