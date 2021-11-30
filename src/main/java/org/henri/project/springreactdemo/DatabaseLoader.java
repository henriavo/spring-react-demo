package org.henri.project.springreactdemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component // means it will be automatically picked up by @SpringBootApplication
public class DatabaseLoader implements CommandLineRunner {
    // implementing clr so that it runs after all beans are created and registered

    private final EmployeeRepository repository;

    @Autowired
    public DatabaseLoader(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) throws Exception {  // invoked w/ command line args, loading up my data
        this.repository.save(new Employee("Diego",
                        "Luna",
                        "Mexican actor, singer, director, and producer."));

        this.repository.save(new Employee("Bartholomew", "Simpson", "el barto"));
        this.repository.save(new Employee("Lenford", "Leonard", "jerk"));
        this.repository.save(new Employee("Otto", "Mann", "school bus driver"));
        this.repository.save(new Employee("Martin", "Prince Jr.", "Martin Priss"));
        this.repository.save(new Employee("Cecil", "Terwilliger", "criminal mastermind"));
        this.repository.save(new Employee("Doris", "Freedman", "cafeteria chef and nurse"));
    }
}
