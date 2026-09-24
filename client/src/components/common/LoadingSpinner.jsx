import { VStack, Spinner, Text } from "@chakra-ui/react";

export const LoadingSpinner = ({ message = "Loading adventure..."}) => {
    return(
        <VStack
            colorPalette="teal"
        >
            <Spinner 
                color="teal" 
                size="xl"
                animationDuration="0.75s"
                borderWidth="4px"
            />
                <Text
                    mt={4}
                    fontFamily="body"
                    color="fg.muted"
                    fontSize="sm"
                    fontWeight="md"
                >
                    {message}
                </Text>
        </VStack>
    )
}