# Angular
This project is intended to be a learning platform for Angular web solutions.

# Steps
## 1
Clone GIT repository (I'm using the Desktop GitHub app)
## 2
Instantiate a new angular application
```console
ng new client
cd client
ng s
```
Open `localhost:4200` in preffered web browser.

## 3
Instantiate a new DotNet Core web-api application.

Go up to the root directory `cd ..`

Create a new web-api project with the following code
```console
mkdir webapi
cd webapi
dotnet new webapi
```
Press `F5` in studio code.

Select .NET Core

Press `F5` again.

Navigate to `http://localhost:5000/api/values`
It should read: `["value1","value2"]`

For simplicity we shall install dotnet watch, so our app will recompile on filechange simular to `ng serve`.
### Add a `Microsoft.DotNet.Watcher.Tools` package reference to the .csproj file:


```xml
<ItemGroup>
    <DotNetCliToolReference Include="Microsoft.DotNet.Watcher.Tools" Version="2.0.0" />
</ItemGroup> 
```
### Install the `Microsoft.DotNet.Watcher.Tools` package by running the following command:
```console
dotnet restore
```
### Execute the command by running
```console
dotnet watch run
```
Everytime a dotnet project file is changed, webapi will recompile for you.

