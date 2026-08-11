import Header from "../components/Header";
import Footer from "../components/Footer";

import { 
    Flex,
    Box, 
    Heading
} from "@chakra-ui/react";

function Itineraries() {
    return(
        <Flex
            direction="column"
            minHeight="100vh"
        >

            <Header />

            <Box flex="1">
                    <Heading>Itineraries Page</Heading>
            </Box>

            <Footer />

        </Flex>
    )
}

export default Itineraries;