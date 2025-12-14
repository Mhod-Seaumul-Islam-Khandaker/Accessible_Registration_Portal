def home():
    print("Welcome to the Home Page")
    print("Choose an option:")
    print("1. Accessibility settings")
    print("2. Sign Up")
    print("3. Log In")
    print("4. Exit")
    choice = int(input("Enter your choice (1-4): "))
    return choice
def accessibility_settings():
    '''
    Docstring for accessibility_settings
1.  Screen reader Support 
2.  Magnifier
3.  Theme: Light /Dark
4.  Adjust font size
5.  Color inversion

    '''
    print("Accessibility Settings Page")
    print("Choose an option:")
    print("1. Enable Screen Reader Support")
    print("2. Enable Magnifier")
    print("3. Change Theme (Light/Dark)")
    print("4. Adjust Font Size")
    print("5. Enable Color Inversion")
    choice = int(input("Enter your choice (1-5): "))
    return choice
def accessibility_status(accessibility):
    print("Current Accessibility Settings:")
    print(f"Screen Reader Support: {'Enabled' if accessibility[1] else 'Disabled'}")
    print(f"Magnifier: {'Enabled' if accessibility[2] else 'Disabled'}")
    print(f"Theme: {accessibility[3]}")
    print(f"Font Size: {accessibility[4]}")
    print(f"Color Inversion: {'Enabled' if accessibility[5] else 'Disabled'}")
def update_accessibility_settings(accessibility, choice):
    if choice == 1:
        accessibility[1] = not accessibility[1]
    elif choice == 2:
        accessibility[2] = not accessibility[2]
    elif choice == 3:
        while True:
            new_theme = input("Enter theme (Light/Dark): ")
            if new_theme in ["Light", "Dark"]:
                accessibility[3] = new_theme
                break
            else:
                print("Invalid theme choice. Please enter 'Light' or 'Dark'.")
    elif choice == 4:
        new_size = int(input("Enter font size (e.g., 10, 12, 14): "))
        accessibility[4] = new_size
    elif choice == 5:
        accessibility[5] = not accessibility[5]
    else:
        print("Invalid choice.")
    print("Accessibility settings updated.")
    return accessibility
def login():
    """
    Docstring for login
    Email
    Password
    Log in
    Forget password
    """
    print("Login Page")
    email = input("Enter your email: ")
    password = input("Enter your password: ")
    print("Logging in...")
    # Here you would add logic to verify the email and password
    print("Logged in successfully!")