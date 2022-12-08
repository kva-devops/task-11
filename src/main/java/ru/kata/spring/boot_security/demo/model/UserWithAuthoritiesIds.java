package ru.kata.spring.boot_security.demo.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;


@AllArgsConstructor
@Getter
@Setter
public class UserWithAuthoritiesIds {
    private int id;
    private String firstName;
    private String lastName;
    private short age;
    private String username;
    private String password;
    private String[] authoritiesIds;

    public User createUserWithRoleSet() {
        User user = new User(id, firstName, lastName, age, username, password);
        user.setEnabled(true);
        return user;
    }
}
