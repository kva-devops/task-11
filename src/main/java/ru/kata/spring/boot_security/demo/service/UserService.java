package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.model.UserWithAuthoritiesIds;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<User> findUserById(Integer id);

    void deleteUserById(Integer id);

    List<User> getAllUsers();

    void createOrUpdateUser(UserWithAuthoritiesIds userDto);

}
