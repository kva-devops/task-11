package ru.kata.spring.boot_security.demo.service;

import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.RoleRepository;
import ru.kata.spring.boot_security.demo.dao.UserRepository;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.model.UserWithAuthoritiesIds;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public Optional<User> findUserById(Integer id) {
        return userRepository.findById(id);
    }

    @Transactional
    @Override
    public void deleteUserById(Integer id) {
        userRepository.deleteById(id);
    }

    @Transactional
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAllByOrderById();
    }

    @Transactional
    @Override
    public void createOrUpdateUser(UserWithAuthoritiesIds userDto) {
        User user = userDto.createUserWithRoleSet();
        if (userDto.getAuthoritiesIds().length != 0) {
            Set<Role> roleSet = findRolesByIds(userDto.getAuthoritiesIds());
            user.setRoleSet(roleSet);
        }
        if (user.getId() == null) {
            createUser(user);
        } else {
            updateUser(user);
        }
    }

    private void createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    private void updateUser(User user) {
        Optional<User> userFromDB = userRepository.findById(user.getId());
        if (user.getAuthorities() == null) {
            user.setRoleSet(userFromDB.get().getRoleSet());
        }
        if (user.getPassword().equals("")) {
            user.setPassword(userFromDB.get().getPassword());
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        user.setEnabled(user.isEnabled());
        userRepository.save(user);
    }

    private Set<Role> findRolesByIds(String[] ids) {
        Set<Integer> integersIds = Arrays.stream(ids).map(Integer::parseInt).collect(Collectors.toSet());
        Set<Role> result = new HashSet<>();
        for (Integer id : integersIds) {
            result.add(roleRepository.findById(id).get());
        }
        return result;
    }
}
