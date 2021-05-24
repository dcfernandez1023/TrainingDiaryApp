class Test:
    def test(self, test1, test2):
        print("Param 1: " + test1)
        print("Param 2: " + test2)

###############################


def exec_dynamic(obj, func_name, params):
    method = getattr(obj, func_name)
    method(**params)


test = Test()
exec_dynamic(test, "test", dict(test1="Hello World", test2="My name is Dom"))

