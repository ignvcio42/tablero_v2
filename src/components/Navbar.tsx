import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Group, Text, Container, Burger, Menu, Avatar } from '@mantine/core';
import { useState } from 'react';
import DarkMode from "./DarkMode";

export default function Navbar() {
    const { data: sessionData } = useSession();
    const [opened, setOpened] = useState(false);

    const handleSignOut = async () => {
        await signOut({ redirect: false });      
        window.location.assign("/api/auth/federated-logout");
      };

    return (
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
            <Container size="lg" className="py-4">
                <Group justify="space-between" align="center">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Text size="xl" fw={700} className="text-white">
                            Todo App
                        </Text>
                    </div>

                    {/* Desktop Navigation */}
                    <Group className="hidden md:flex" gap="lg">
                        {sessionData && (
                            <Text size="sm" className="text-white/80">
                                Hola, {sessionData.user?.email}
                            </Text>
                        )}
                        <div className="hidden md:block">
                            <Button
                                variant="filled"
                                color="blue"
                                radius="lg"
                                className="bg-blue-700 hover:bg-blue-800 text-white"
                                onClick={sessionData ? handleSignOut : () => void signIn()}
                            >
                                {sessionData ? "Cerrar sesión" : "Iniciar sesión"}
                            </Button>
                        </div>
                        <div className="hidden md:block">
                            <DarkMode />
                        </div>
                    </Group>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center gap-2">
                        <DarkMode />
                        <Menu
                            opened={opened}
                            onClose={() => setOpened(false)}
                            position="bottom-end"
                            shadow="md"
                            width={200}
                        >
                            <Menu.Target>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                />
                            </Menu.Target>

                            <Menu.Dropdown className="bg-white/95 backdrop-blur-md">
                                {sessionData && (
                                    <Menu.Label className="text-gray-700">
                                        {sessionData.user?.email}
                                    </Menu.Label>
                                )}
                                <Menu.Item
                                    onClick={sessionData ? () => void signOut() : () => void signIn()}
                                    className="text-gray-700 hover:bg-blue-50"
                                >
                                    {sessionData ? "Cerrar sesión" : "Iniciar sesión"}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </div>
                </Group>
            </Container>
        </nav>
    );
}
