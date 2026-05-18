from app.python_test import jkrc
import time

def test():
    robot = jkrc.RC("192.168.56.103")

    print("Login...")
    ret = robot.login()
    print(ret)

    print("Power ON...")
    ret = robot.power_on()
    print(ret)

    time.sleep(2)

    print("Enable robot...")
    ret = robot.enable_robot()
    print(ret)

    print("Robot enabled!")

