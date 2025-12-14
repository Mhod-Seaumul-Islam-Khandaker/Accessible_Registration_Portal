import util
def main():
    accessibility={1:False,2:False,3:"Light",4:11,5:False}
    while True:
        choice = util.home()
        if choice == 1:
            util.accessibility_status(accessibility)
            ac_choice = util.accessibility_settings()
            accessibility = util.update_accessibility_settings(accessibility, ac_choice)
            continue
        elif choice == 2:
        util.login()
        
