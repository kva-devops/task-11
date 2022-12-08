package ru.kata.spring.boot_security.demo.controller;

import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.model.UserWithAuthoritiesIds;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/")
    public List<User> findAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable int id) {
        return userService.findUserById(id).get();
    }

    @PostMapping("/")
    public void create(@RequestBody UserWithAuthoritiesIds userDto) {
        userService.createOrUpdateUser(userDto);
    }

    @PutMapping("/")
    public void update(@RequestBody UserWithAuthoritiesIds userDto) {
        userService.createOrUpdateUser(userDto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        userService.deleteUserById(id);
    }

    @GetMapping("/authenticated")
    public User findAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return  (User) authentication.getPrincipal();
    }
}
