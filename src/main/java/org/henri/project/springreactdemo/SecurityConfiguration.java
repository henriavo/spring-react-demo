package org.henri.project.springreactdemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/*
the @PreAuthorize applied to the repo need this class
 */

@Configuration
@EnableWebSecurity //(1)
@EnableGlobalMethodSecurity(prePostEnabled = true) //(2)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter { //(3)

    @Autowired
    private SpringDataJpaUserDetailsService userDetailsService; //(4)

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(this.userDetailsService)
                .passwordEncoder(Manager.PASSWORD_ENCODER);
    }

    // pivotal security policy is written here
    @Override
    protected void configure(HttpSecurity http) throws Exception { //(5)
        http
                .authorizeRequests()
                // granted unconditional access, since there is no reason to block static web resources.
                .antMatchers("/built/**", "/main.css").permitAll()
                // Anything that does not match that policy falls into here and requires authentication.
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .defaultSuccessUrl("/", true)
                .permitAll()
                .and()
                .httpBasic()
                .and()
                .csrf().disable() // not prod recommended. used to make interaction with curl easier.
                .logout()
                .logoutSuccessUrl("/");
    }

}
