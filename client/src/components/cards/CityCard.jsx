import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { deleteCity } from "../../services/cityServices";
import { toaster } from "../ui/toaster";
import { MapPin, Pencil, Trash } from "lucide-react";
import { 
    Badge,
    Button,
    Card, 
    HStack, 
    IconButton,
    Image,
    Separator,
    VStack
} from "@chakra-ui/react";
import { ConfirmDialog } from "../dialogs/ConfirmDialog";

function CityCard({ city, onDeleted }) {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin'

    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    const [ isDeleting, setIsDeleting ] = useState(false);
    const navigate = useNavigate();

    const handleDeleteConfirm = async () => {
       setIsDeleting(true); 
       try {
        await deleteCity(city._id)
        toaster.create({
            title: "City Deleted",
            description: "The city was successfully deleted",
            type: "success",
        })
        setIsDialogOpen(false);
        if (onDeleted) onDeleted(city._id)
       } catch (error) {
        toaster.create({
            title: "Error",
            description: "Error deleting the city",
            type: 'error',
        })
       } finally {
        setIsDeleting(false)
       }
    }

    return (
        <Card.Root 
            overflow="hidden"
            borderRadius="xl"
        >
            <Image 
                src={city.image}
                alt={`${city.name} City`}
                borderRadius="xl"
                w="full"
                h="50%"
                objectFit="cover"
            />
            <Card.Body gap={2}>
                <Card.Title>{city.name}, {city.country}</Card.Title>
                <Badge
                    size="md"
                    bg="ink.600"
                    color="paper.50"
                    w="fit-content"
                >
                    {city.continent}
                </Badge>
                <Card.Description lineClamp={2}>
                    {city.description}
                </Card.Description>
            </Card.Body>
            <Separator mb={2} size="lg"/>
            <Card.Footer
                display='flex'
                justifyContent="space-between"
                alignItems="center"
                mt={2}
            >
                <VStack
                    w="full"
                >
                    <HStack
                        w='full'
                        justifyContent="space-between"
                    >
                        <MapPin size={22}/>
                        <Button
                            variant="solid"
                            bg="amber"
                            onClick={() => navigate(`/itineraries/${city._id}`)}
                        >
                            Explore {city.name}
                        </Button>
                    </HStack>
                    {isAdmin && (
                        <HStack
                            w="full"
                            justifyContent="flex-end"
                        >
                            <IconButton
                                colorPalette="teal.400"
                                onClick={() => navigate(`/cities/edit/${city._id}`)}
                            >
                                <Pencil />
                            </IconButton>
                            <IconButton
                                colorPalette="red"
                                onClick={() => setIsDialogOpen(true)}
                            >
                                <Trash />
                            </IconButton>
                        </HStack>
                    )}
                </VStack>
            </Card.Footer>
            <ConfirmDialog 
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                title={`Are you sure you want to delete this city '${city.name}'?`}
                description="This action cannot be undone, and you will no longer be able to access the itineraries"
            />
        </Card.Root>
    )
}

export default CityCard;