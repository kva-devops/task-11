package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;

@Controller
public class IndexController {


    @GetMapping(value = {"/user"})
    public String loadPageUser(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authenticatedUser = (User) authentication.getPrincipal();
        model.addAttribute("authenticatedUser", authenticatedUser);
        return "index";
    }

    @GetMapping(value = "/admin")
    public String loadPageAdmin(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authenticatedUser = (User) authentication.getPrincipal();
        model.addAttribute("authenticatedUser", authenticatedUser);
        return "index";
    }
}
