import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { useNavigate } from "react-router";
import { deleteItinerary } from "../../services/itineraryService";
import { ConfirmDialog } from "../dialogs/ConfirmDialog";
import { toaster } from "../ui/toaster";

import { CalendarRange, Heart, Pencil, Sparkles, Trash, Wallet } from "lucide-react";
import { 
    Button,
    Card, 
    Flex,
    HStack,
    IconButton, 
    Text,
    VStack
} from "@chakra-ui/react";

function ItineraryCard({ itinerary, onFavoriteToggled, onDeleted }) {
    const { user } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();
    const navigate = useNavigate();

    const isFav = isFavorite(itinerary._id)

    const getPriceLabel = (totalPrice, durationInDays) => {
        const price = Number(totalPrice) || 0;
        const days = Number(durationInDays) || 1;
        const costPerDay = price / days;

        if (costPerDay <= 50) return "$ Low";
        if (costPerDay <= 150) return "$$ Moderate";
        return "$$$ Premium"
    }

    const pathType = itinerary.createdBy ? "Community Path" : "Official Path";
    const isAdmin = user?.role === 'admin';
    const isOwner = user?._id === itinerary.createdBy?._id || user?._id === itinerary.createdBy;
    const canManage = isAdmin || isOwner
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ isDeleting, setIsDeleting ] = useState(false);

    const handleFavoriteClick = async () => {
        try {
            await toggleFavorite(itinerary._id);
            if (onFavoriteToggled) {
               onFavoriteToggled(itinerary._id, !isFav) 
            }
        } catch (error) {
            toaster.create({
                title: "Error",
                description: "Couldn't update favorites",
                type: "error",
            });
        }
    }

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await deleteItinerary(itinerary._id);
            toaster.create({
                title: 'Itinerary Deleted',
                description: 'The itinerary was successfully deleted',
                type: 'success',
            })
            setIsDialogOpen(false)
            if (onDeleted) onDeleted(itinerary._id)
        } catch (error) {
            toaster.create({
                title: 'Error',
                description: 'Error deleting the itinerary',
                type: 'error',
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Card.Root>
            <Card.Body>
                <Card.Title mt={2}>{itinerary.title}</Card.Title>
                <Card.Description lineClamp={2}>
                    {itinerary.description}
                </Card.Description> 

                <Flex 
                    wrap="wrap"
                    gap="8px 12px"
                    fontSize="sm"
                    mt={4}
                    w="full"
                    align="center"
                >

                    <HStack gap={1} as="div">
                        <CalendarRange size={14}/>
                        <Text as="span">
                            {itinerary.durationInDays} Days
                        </Text>
                    </HStack>

                    <Text as="span">•</Text>

                    <HStack gap={1} as="div">
                        <Wallet size={14}/>
                        <Text as="span">
                            {getPriceLabel(itinerary.priceTotal, itinerary.durationInDays)}
                        </Text>
                    </HStack>

                    <Text as="span">•</Text>

                    <HStack gap={1} as="div">
                        <Sparkles size={14}/>
                        <Text>
                            {pathType}
                        </Text>
                    </HStack>

                </Flex>
            </Card.Body>
            <Card.Footer>
                <VStack>
                    <HStack
                        gap={4}
                        w='full'
                        justifyContent="flex-start"
                    >
                        <Button
                            variant="subtle"
                            bg="amber"
                            color="white"
                            _hover={{ bg: 'amber.600' }}
                            size="md"
                            onClick={() => navigate(`/itineraries/details/${itinerary._id}`)}
                        >
                            View Details
                        </Button>
                        {user && (
                            <IconButton
                                onClick={handleFavoriteClick}
                                variant="ghost"
                                aria-label="Toggle favorite"
                            >
                                <Heart 
                                    fill={isFav ? 'red' : 'none'} 
                                    color={isFav ? 'red' : 'gray'}
                                />
                            </IconButton>
                        )}
                    </HStack>
                    {user && canManage && (
                        <HStack 
                            gap={4}
                            w="full"
                            justifyContent="flex-start"
                        >
                            <Button
                                onClick={() => navigate(`/itineraries/edit/${itinerary._id}`)}
                                colorPalette="teal"
                            >
                                <Pencil /> 
                            </Button>
                            <Button
                                onClick={() => setIsDialogOpen(true)}
                                colorPalette="red"
                            >
                                <Trash /> 
                            </Button>
                            <ConfirmDialog 
                                open={isDialogOpen}
                                onClose={() => setIsDialogOpen(false)}
                                onConfirm={handleDeleteConfirm}
                                isLoading={isDeleting}
                                title="Are you sure you want to delete the itinerary?"
                                description="This action cannot be undone"
                            />
                        </HStack>
                    )}
                </VStack>
            </Card.Footer>
        </Card.Root>
    )
}

export default ItineraryCard