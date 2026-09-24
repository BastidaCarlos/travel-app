import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createCity, updateCity } from "../../services/cityServices";
import { toaster } from "../ui/toaster";
import { Building, Earth, ImageUp, MapPinned, Send } from "lucide-react";
import { 
    Alert,
    Box,
    Button,
    createListCollection,
    Field,
    Heading,
    HStack,
    Input,
    InputGroup,
    Portal,
    Select,
    Textarea,
    VStack 
} from "@chakra-ui/react";
    
const continentList = createListCollection({
    items: [
        { label: 'Africa', value: 'Africa' },
        { label: 'America', value: 'America' },
        { label: 'Asia', value: 'Asia' },
        { label: 'Europe', value: 'Europe' },
        { label: 'Oceania', value: 'Oceania' },
    ],
})

function CreateCity({ initialData, cityId }) {
    const navigate = useNavigate();
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ cityError, setCityError ] = useState('');
    const [ cityData, setCityData ] = useState({
        name: '',
        country: '',
        continent: '',
        image: '',
        description: ''
    })

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCityData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const requiredFields = [cityData.name, cityData.country, cityData.continent, cityData.image]
    const hasEmptyFields = requiredFields.some(field => !field || field.trim() === '');
    const isEditMode = Boolean(cityId)
    const navigateTo = '/cities'

    useEffect(() => {
        if (initialData) {
            setCityData({
                name: initialData.name,
                country: initialData.country,
                continent: initialData.continent,
                image: initialData.image,
                description: initialData.description || ''
            })
        }
    }, [initialData])

    const handleCancel = () => {
        setCityData({
            name: '',
            country: '',
            continent: '',
            image: '',
            description: ''
        })
        navigate(navigateTo)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (hasEmptyFields) {
           setCityError('Please fill in all required fields'); 
           return;
        }

        setCityError('');
        setIsSubmitting(true);

        try {
            if (cityId) {
                await updateCity(cityId, cityData)
                toaster.create({
                    title: 'Success',
                    description: 'The city was updated correctly',
                    type: 'success',
                })
                navigate(navigateTo)
                return;
            }

            await createCity(cityData)
            toaster.create({
                title: 'Success',
                description: 'The city was created correctly',
                type: 'success',
            })

            setCityData({
                name: '',
                country: '',
                continent: '',
                image: '',
                description: '',
            })

        } catch (error) {
            toaster.create({
                title: 'Error',
                description: 'Error creating the city',
                type: 'error',
            })
        } finally {
            setIsSubmitting(false)
        }

    }

    return(
        <Box 
            as="section"
            w="full"
            maxW={{ base: '90%', lg: '600px', xl: '900px' }}
            p={8}
            bg="teal"
            color='white'
            borderRadius="2xl"
            mx="auto"
        >
            <VStack 
                as="form"
                onSubmit={handleSubmit}
                w="full"
                mt={4}
            >
                <Heading as="h1">
                    {isEditMode ? 'Edit City' : 'Create City'}
                </Heading>

                <Field.Root
                    w="full"
                >
                    <Field.Label fontSize="md">
                        City
                    </Field.Label>
                    <InputGroup startElement={<Building />}>
                        <Input 
                            type="text"
                            name="name"
                            value={cityData.name}
                            onChange={handleChange}
                            variant="subtle"
                            placeholder="City Name..."
                            color="black"
                        />
                    </InputGroup>
                </Field.Root>
                <Field.Root>
                    <Field.Label fontSize="md">
                        Country
                    </Field.Label>
                    <InputGroup startElement={<MapPinned />}>
                        <Input 
                            type="text"
                            name="country"
                            value={cityData.country}
                            onChange={handleChange}
                            variant="subtle"
                            placeholder="Country..."
                            color="black"
                        />
                    </InputGroup>
                </Field.Root>
                <Field.Root>
                    <Field.Label fontSize="md">
                        URL Image
                    </Field.Label>
                    <InputGroup startElement={<ImageUp />}>
                        <Input 
                            type="text"
                            name="image"
                            value={cityData.image}
                            onChange={handleChange}
                            variant="subtle"
                            placeholder="URL Image..."
                            color="black"
                        />
                    </InputGroup>
                </Field.Root>
                <Select.Root
                    value={cityData.continent ? [cityData.continent] : []}
                    onValueChange={(details) => (
                        setCityData(prevData => ({
                            ...prevData,
                            continent: details.value[0]
                        }))
                    )}
                    name="continent"
                    collection={continentList}
                    variant="subtle"
                    color="black"
                >
                    <Select.HiddenSelect />
                    <Select.Label color="white" fontSize="md">Continent</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <HStack>
                                <Earth />
                                <Select.ValueText placeholder="Select Continent..."/>
                            </HStack>
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {continentList.items.map((continent) => (
                                    <Select.Item item={continent} key={continent.value}>
                                        {continent.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
                <Field.Root>
                    <Field.Label fontSize="md">
                        City Description
                    </Field.Label>
                    <Textarea 
                        value={cityData.description}
                        onChange={handleChange}
                        name="description"
                        color="black"
                        variant="subtle"
                        autoresize
                        placeholder="City..."
                        maxLength={500}
                    />
                    <Field.HelperText color="white">{cityData.description.length} / 500</Field.HelperText>
                </Field.Root>

                {cityError && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Invalid Fields</Alert.Title>
                            <Alert.Description>
                                {cityError}
                            </Alert.Description>
                        </Alert.Content>
                    </Alert.Root>
                )}
                
                <HStack>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant='solid'
                        colorPalette="teal"
                    >
                        <Send /> {isEditMode ? 'Update City' : 'Create City'}
                    </Button>
                    <Button
                        type="button"
                        disabled={isSubmitting}
                        variant="solid"
                        colorPalette="red"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </HStack>
            </VStack>
        </Box>
    )
}

export default CreateCity;