import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import { getPublicProfile, getMyFavorites } from "../../services/userService";
import { updateProfile } from "../../services/authServices";
import ItineraryCard from "../../components/cards/ItineraryCard";
import { StateMessage } from "../../components/common/StateMessage";
import { 
    Avatar,
    Badge,
    Blockquote,
    Box,
    Button,
    CloseButton,
    Dialog,
    Field,
    FileUpload,
    Flex,
    Grid,
    Heading,
    HStack,
    Input,
    InputGroup,
    Portal,
    Stack,
    Tabs,
    Text,
    Textarea,
    VStack
} from "@chakra-ui/react";
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import { AlertCircle, BookDashed, FolderPlus, Heart, ImageUp, LogOut, Mail, Pencil, SwatchBook, User } from "lucide-react";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useNavigate } from "react-router";
import { uploadImage } from "../../services/uploadService";
import { toaster } from "../../components/ui/toaster";

function Profile() {
    const { user, updateUser, logout } = useAuth();
    const [ open, setOpen ] = useState(false);
    const [ userData, setUserData ] = useState(user);
    const [ loadingUpload, setLoadingUpload ] = useState(false);
    const [ fileError, setFileError ] = useState('');
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ previewUrl, setPreviewUrl ] = useState(null);

    const myItineraries = useFetch(() => getPublicProfile(user._id))
    const myFavorites = useFetch(() => getMyFavorites());
    const navigate = useNavigate();

    const handleOpenChange = (e) => {
        setOpen(e.open);
        if (e.open) {
            setUserData({ 
                name: user?.name || '',
                bio: user?.bio || '' 
            });
            setFileError('');
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleFileAccept = (details) => {
        const file = details.files[0];
        const maxSize= 5 * 1024 * 1024;
         
        if (!file) return;
        if (file.size > maxSize) {
           setFileError('The file is too large, max size is 5MB') 
           return;
        }

        setFileError('')
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }

    const handleUploadData = async (e) => {
        e.preventDefault()
        setLoadingUpload(true);
        try {
            const updatePayload = { name: userData.name, avatar: userData.avatar, bio: userData.bio }

            if (selectedFile) {
                const secureUrl = await uploadImage(selectedFile);
                updatePayload.avatar = secureUrl;
            }

            const savedUser = await updateProfile(updatePayload)
            updateUser(savedUser)

            setSelectedFile(null);
            setPreviewUrl(null);
            setOpen(false);

            toaster.create({
                title: "Saved",
                description: "Your profile has been successfully updated",
                type: "success",
            })

        } catch (error) {
            toaster.create({
                title: "Error",
                description: "Could not save changes. Please try again",
                type: "error",
            });
        } finally {
            setLoadingUpload(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            myItineraries.execute()
        }
    }, [user?._id])

    return (
        <Box
            as="section"
            display="flex"
            flexDirection="column"
            gap={8}
            justifyContent="center"
            alignContent="center"
        >
            < Header />

            <Box    
                as="div"
                flex="1"
                w="full"
                maxW={{
                    base: "100%",
                    lg: "900px",
                    xl: "1200px"
                }}
                px={4}
                mt={6}
                m="auto"
            >
                <Flex
                    direction="column"
                    bg="paper.100"
                    borderRadius="xl"
                    boxShadow="xl"
                    borderColor='paper.300'
                    border="1px dashed"
                    alignItems="center"
                    justifyItems="center"
                    p={6}
                    mb={8}
                >
                    <Flex
                        direction={{ base: 'column', md: 'row'}}
                        w="full"
                        mx="auto"
                        my={4}
                        p={6}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Avatar.Root shape="full" boxSize="150px">
                            <Avatar.Fallback name={user.name} />
                            <Avatar.Image src={user.avatar} />
                        </Avatar.Root>
                        <VStack
                            alignItems={{ base: 'center', md: 'flex-start' }}
                            textAlign={{ base: 'center', md: "left"}}
                            ml={{ md: "8"}}
                        >
                            <Badge 
                                textTransform="uppercase"
                                fontSize="sm"
                                fontWeight="medium"
                                bg="ink.700"
                                color="paper.50"
                            >
                                Traveler profile
                            </Badge>
                    
                            <Heading
                                as="h1"
                            >
                                Welcome back, {user.name}
                            </Heading>
                            <Text fontWeight="bold">Who i am!</Text>
                            <Blockquote.Root colorPalette="teal">
                                <Blockquote.Content>
                                    {user.bio ? user.bio : "You don't have a bio yet."}
                                </Blockquote.Content>
                            </Blockquote.Root>
                            <Text
                                fontSize="sm"
                            >
                                Curating journeys, collecting memories, and exploring the globe one path at a time
                            </Text>
                        </VStack>
                    </Flex>
                    <HStack>
                        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
                            <Dialog.Trigger asChild>
                                <Button variant="subtle" bg="amber.400" color="white">
                                    <Pencil size={14}/>
                                    Edit
                                </Button>
                            </Dialog.Trigger>
                            <Portal>
                                <Dialog.Backdrop />
                                <Dialog.Positioner >
                                    <Dialog.Content as="form" onSubmit={handleUploadData}>
                                        <Dialog.CloseTrigger />
                                        <Dialog.Header justifyContent="center">
                                            <VStack gap={4}>
                                                <Dialog.Title>Edit Profile</Dialog.Title>
                                                <Avatar.Root boxSize="100px">
                                                    <Avatar.Fallback name={user?.name} />
                                                    <Avatar.Image src={previewUrl ? previewUrl : user?.avatar} />
                                                </Avatar.Root>
                                            </VStack>
                                        </Dialog.Header>
                                        <Dialog.Body pb="4">
                                            <Stack gap={4}>
                                                <Field.Root>
                                                    <Field.Label>
                                                        Avatar
                                                    </Field.Label>
                                                    <Field.HelperText>Choose a clear Image that represent your traveler spirit</Field.HelperText>
                                                    <FileUpload.Root alignItems="flex-start" onFileAccept={handleFileAccept}>
                                                        <FileUpload.HiddenInput />
                                                        <FileUpload.Trigger asChild disabled={loadingUpload}>
                                                            <Button variant="outline" w="full" justifyContent="flex-start" gap={2}>
                                                                <ImageUp /> Select Image
                                                            </Button>
                                                        </FileUpload.Trigger>
                                                        {fileError && <Text color="red" fontSize="sm">{fileError}</Text>}
                                                    </FileUpload.Root>
                                                </Field.Root>
                                                <Field.Root>
                                                    <Field.Label>
                                                        Name
                                                    </Field.Label>
                                                    <Field.HelperText>This is the name that will be displayed on the paths you share.</Field.HelperText>
                                                    <InputGroup startElement={<User />} gap={2}>
                                                        <Input 
                                                            placeholder={user.name}
                                                            name="name"
                                                            id="name"
                                                            type="text"
                                                            value={userData.name}
                                                            onChange={onChange}
                                                        />
                                                    </InputGroup>
                                                </Field.Root>
                                                <Field.Root>
                                                    <Field.Label>Profile bio</Field.Label>
                                                    <Field.HelperText>A short description of yourself</Field.HelperText>
                                                    <Textarea 
                                                        value={userData.bio}
                                                        onChange={onChange}
                                                        name="bio"
                                                        id="bio"
                                                        maxLength={200}
                                                        placeholder={user.bio ? user.bio : 'I am ...'}
                                                        autoresize
                                                    />
                                                    <Field.HelperText>
                                                        { userData.bio?.length || 0 } / 200 characters
                                                    </Field.HelperText>
                                                </Field.Root>
                                                <Field.Root>
                                                    <Field.Label>
                                                        Email
                                                    </Field.Label>
                                                    <Field.HelperText>Your email address cannot be changed here.</Field.HelperText>
                                                    <InputGroup startElement={<Mail size={16}/>}>
                                                        <Input placeholder={user.email} disabled/>
                                                    </InputGroup>
                                                </Field.Root>
                                            </Stack>
                                        </Dialog.Body>
                                        <Dialog.Footer>
                                            <Dialog.ActionTrigger asChild>
                                                <Button variant="outline" colorPalette="red" disabled={loadingUpload}>Cancel</Button>
                                            </Dialog.ActionTrigger>
                                            <Button
                                                type="submit"
                                                loading={loadingUpload}
                                                bg="ink.600"
                                                _hover={{ bg: "ink.800" }}
                                            >
                                                Save
                                            </Button>
                                        </Dialog.Footer>
                                        <Dialog.CloseTrigger asChild>
                                            <CloseButton size="sm" />
                                        </Dialog.CloseTrigger>
                                    </Dialog.Content>
                                </Dialog.Positioner>
                            </Portal>
                        </Dialog.Root>

                        <Button colorPalette="red" onClick={() => logout()}>
                            <LogOut size={16} />
                            Log Out
                        </Button>
                    </HStack>
                </Flex>

                <VStack
                    w="full"
                >
                    <Tabs.Root
                        variant="line"
                        defaultValue="itineraries"
                        w="full"
                        onValueChange={(details) => {
                            if (details.value === "itineraries") myItineraries.execute();
                            if (details.value === "saved") myFavorites.execute();
                        }}
                    >
                        <Tabs.List
                            w="fit-content"
                            mx="auto"
                            mb={6}
                        >
                            <Tabs.Trigger value="itineraries"><SwatchBook /> My Itineraries</Tabs.Trigger>
                            <Tabs.Trigger value="saved"><Heart /> Saved Paths</Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="itineraries">
                            <HStack
                                justify="center"
                                mb={6}
                            >
                                <Badge
                                    size="lg"
                                    h="40px"
                                    variant="solid"
                                    bg="teal"
                                    color="white"
                                >
                                    Itineraries Created: {myItineraries.data?.itineraries?.length}
                                </Badge>
                                <Button
                                    onClick={() => navigate('/profile/create-itinerary')}
                                    colorPalette="teal"
                                >
                                    <FolderPlus /> Create Itinerary
                                </Button>
                            </HStack>
                            {myItineraries.loadingFetch && <LoadingSpinner message="Loading Itineraries..." />}
                            {myItineraries.fetchError && (
                                <VStack w="full" py={8}>
                                    <StateMessage 
                                        title="Error loading"
                                        description="We were unable to retrieve the information"
                                        icon={<AlertCircle size={16} />}
                                        colorPalette="red"
                                    />
                                </VStack>
                            )}

                            {!myItineraries.loadingFetch && !myItineraries.fetchError && (
                                myItineraries.data?.itineraries?.length === 0 ? (
                                    <VStack 
                                        w="full" 
                                        justify="center" 
                                        align="center" 
                                        textAlign="center" 
                                        gap={4} 
                                        py={8}
                                    >
                                        <StateMessage 
                                            title="No paths created yet"
                                            description="You haven't publish any itineraries yet. Start crafting your first route and share with the community"
                                            icon={<BookDashed size={16}/>}
                                            colorPalette="gray"
                                        />
                                        <Button
                                            colorPalette="teal"
                                            onClick={() => navigate('/profile/create-itinerary')}
                                        >
                                            Create an Itineray
                                        </Button>
                                    </VStack>
                                ) : (
                                    <Grid
                                        templateColumns={{
                                            base: "1fr",
                                            lg: "repeat(2, minmax(300px, 1fr))",
                                            xl: "repeat(3, minmax(350px, 1fr))"
                                        }}
                                        gap={6}
                                        w="full"
                                    >
                                        {myItineraries.data?.itineraries?.map((itinerary) => (
                                            <ItineraryCard 
                                                key={itinerary._id} 
                                                itinerary={itinerary} 
                                                onDeleted={(id) => myItineraries.setData(prev => ({
                                                    ...prev,
                                                    itineraries: prev.itineraries.filter(it => it._id !== id)
                                                }))}
                                            />
                                        ))}
                                    </Grid>
                                )
                            )}
                        </Tabs.Content>

                        <Tabs.Content value="saved">
                            {myFavorites.loadingFetch && <LoadingSpinner message="Loading Favorites" />}
                            {myFavorites.fetchError && (
                                <VStack w="full" py={8}>
                                    <StateMessage 
                                        title="Error loading"
                                        description="We were unable to retrieve the information"
                                        icon={<AlertCircle size={16}/>}
                                        colorPalette="red"
                                    />
                                </VStack>
                            )}
                            {!myFavorites.loadingFetch && !myFavorites.fetchError && (
                                myFavorites.data?.length === 0 ? (
                                    <VStack 
                                        w="full" 
                                        justify="center" 
                                        align="center" 
                                        textAlign="center" 
                                        gap={4} 
                                        py={8}
                                    >
                                        <StateMessage 
                                            title="No saved yet"
                                            description="Explore the globe, click the heart icon on any itinerary that catches your eye, and save it here for your next adventure"
                                            icon={<BookDashed size={16}/>}
                                            colorPalette="gray"
                                        />
                                        <Button
                                            colorPalette="teal"
                                            onClick={() => navigate('/cities')}
                                        >
                                            Explore itineraries
                                        </Button>
                                    </VStack>
                                ) : (
                                    <Grid
                                        templateColumns={{
                                            base: "1fr",
                                            lg: "repeat(2, minmax(300px, 1fr))",
                                            xl: "repeat(3, minmax(350px, 1fr))"
                                        }}
                                        gap={6}
                                        w="full"
                                    >
                                        {myFavorites.data?.map((itinerary) => (
                                            <ItineraryCard 
                                                key={itinerary._id} 
                                                itinerary={itinerary} 
                                                onFavoriteToggled={(itineraryId, isNowFavorite) => {
                                                    if (!isNowFavorite) {
                                                        myFavorites.setData(prev => prev.filter(item => item._id !== itineraryId)) 
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Grid>
                                )
                            )}
                        </Tabs.Content>
                    </Tabs.Root>
                </VStack>

            </Box>

            <Footer />

        </Box>
    )
}

export default Profile;