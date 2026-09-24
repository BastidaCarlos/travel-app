import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { useAuth } from "../../hooks/useAuth"
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

import { 
    Box,
    VStack,
    Button,
    Heading,
    Link,
    Flex,
    Alert,
    Text,
    Field,
    Input,
    InputGroup,
    Separator,
    AlertIndicator
} from "@chakra-ui/react";
import { User, Mail, LockKeyhole } from "lucide-react";

function Register () {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [ userData, setUserData ] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [ confirmPassword, setConfirPassword ] = useState('');
    const { registerContext, authLoading, error, clearError } = useAuth();
    const { loginWithGoogle } = useGoogleAuth();
    const [ isLoading, setIsLoading ] = useState(false); 
    const [ localError, setLocalError ] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        const requiredFields = [userData.name, userData.email, userData.password, confirmPassword];
        const hasEmptyFields = requiredFields.some(field => !field || field.trim() === '');

        if (hasEmptyFields) {
            setLocalError("All the fields are required");
            return
        }

        if (userData.password !== confirmPassword) {
           setLocalError("The passwords doesn't match");
           return;
        }
        if (userData.password.length < 8) {
           setLocalError("The password must be at least 8 characters long");
           return;
        }
        try {
            setIsLoading(true);
            await registerContext(userData);
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Registration Failed: ", error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Flex
            w="100vw"
            h="100vh"
            align="center"
            justify="center"
            px={4}
            py={8}
        >
            <Box
                w="full"
                maxW={{
                    base: '420px',
                    lg: '500px'
                }}
                bg="white"
                p={{ base: 6, md: 8 }}
                borderRadius="xl"
                boxShadow="xl"
                borderWidth="1px"
                borderColor="paper.200"
            >
                <VStack spacing={6} align="strech">
                    <VStack spacing={2} textAlign="center">
                        <Heading
                            as="h1"
                            fontFamily="heading"
                            size="2xl"
                            color="fg"
                        >
                            Start your journey
                        </Heading>
                        <Text
                            fontFamily="body"
                            color="fg.muted"
                            fontSize="sm"
                        >
                            Create an account to craft, save, and share your personalized travel itineraries
                        </Text>
                    </VStack>
                    <form
                        onSubmit={handleSubmit}
                    >
                        <VStack spacing={4} align="stretch">
                            <Field.Root mt={2}>
                                <Field.Label fontWeight="medium" color="fg">Name:</Field.Label>
                                <InputGroup startElement={<User size={18} />}>
                                    <Input 
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name..."
                                        variant="outline"
                                        borderColor="paper.400"
                                        _focus={{ borderColor: "teal.600", focusRingColor: "teal.200" }}
                                    />
                                </InputGroup>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontWeight="medium" color="fg">Email:</Field.Label>
                                <InputGroup startElement={<Mail size={18} />}>
                                    <Input 
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        variant="outline"
                                        borderColor="paper.400"
                                        _focus={{ borderColor: "teal.600", focusRingColor: "teal.200" }}
                                    />
                                </InputGroup>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontWeight="medium" color="fg">Password:</Field.Label>
                                <InputGroup startElement={<LockKeyhole size={18} />}>
                                    <Input 
                                        type="password"
                                        name="password"
                                        value={userData.password}
                                        onChange={handleChange}
                                        placeholder="********"
                                        variant="outline"
                                        borderColor="paper.400"
                                        _focus={{ borderColor: "teal.600", focusRingColor: "teal.200" }}
                                    />
                                </InputGroup>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontWeight="medium" color="fg">Confirm Password:</Field.Label>
                                <InputGroup startElement={<LockKeyhole size={18} />}>
                                    <Input 
                                        type="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirPassword(e.target.value)}
                                        placeholder="********"
                                        variant="outline"
                                        borderColor="paper.400"
                                        _focus={{ borderColor: "teal.600", focusRingColor: "teal.200" }}
                                    />
                                </InputGroup>
                            </Field.Root>

                            {( localError || error ) && (
                                <Alert.Root status="error" variant="subtle" borderRadius="md" mt={2}>
                                    <AlertIndicator />
                                    <Alert.Title fontSize="sm">{ localError || error }</Alert.Title>
                                </Alert.Root>
                            )}

                        
                            <Button
                                bg="accent.solid"
                                color="white"
                                _hover={{ bg: "accent.emphasized" }}
                                size="lg"
                                width="full"
                                type="submit"
                                loading={isLoading}
                                mt={2}
                            >
                                Create account
                            </Button>

                            <Flex align="center" my={2}>
                                <Separator flex="1" borderColor="paper.200" />
                                <Text px={3} fontSize="xs" color="fg.mutes" textTransform="uppercase">
                                    or
                                </Text>
                                <Separator flex="1" borderColor="paper.200" />
                            </Flex>

                            <Button
                                variant="outline"
                                borderColor="paper.400"
                                color="fg"
                                _hover={{ bg: "paper" }}
                                size="lg"
                                w="full"
                                type="button"
                                onClick={() => loginWithGoogle()}
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: "8px" }}>
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22l.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                Continue with Google
                            </Button>
                        </VStack>
                    </form>

                    <Text textAlign="center" fontSize="sm" color="fg.muted" mt={2}>
                        You already have an account?{" "}
                        <Link
                            color="accent.solid"
                            fontWeight="semibold"
                            href="/login"
                            _hover={{ textDecoration: "underline" }}
                        >
                            Sign In
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Flex>
    )
}

export default Register