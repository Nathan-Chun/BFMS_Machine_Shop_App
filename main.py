import pandas as pd
# import numpy as np
import tkinter as tk
from tkinter import *
from tkinter import messagebox

data = pd.read_csv("Center_Drill_Speeds_and_Feeds.csv")
print(data.head())
df = pd.DataFrame(data)
materialChoices=df["Material Description"].unique()
# col1 = df['ISO']
# print(col1)


class BFMS_Machine_Shop_App:
    def __init__(self, root):
        self.root = root
        self.root.title("BFMS Machine Shop App")

        # To keep content separate from menu bar
        self.contentFrame = tk.Frame(self.root)
        self.contentFrame.pack(fill='both', expand=True)

        # Initialize selected material
        self.selectedMaterial = tk.StringVar(value ="Aluminum")
        self.materialChoices = df["Material Description"].unique()

        # Build Gui
        self.buildMenu()
        self.buildMaterial()

    def buildMenu(self):
        menu = Menu(self.root)
        self.root.config(menu=menu)
        fileMenu = Menu(menu, tearoff = 0)
        fileMenu.add_command(label="New", command=self.newWindow)
        fileMenu.add_separator()
        fileMenu.add_command(label="Exit", command=self.root.destroy)
        menu.add_cascade(label="File", menu=fileMenu)
        helpMenu = Menu(menu, tearoff = 0)
        helpMenu.add_command(label="About", command=self.showAbout)
        menu.add_cascade(label="Help", menu=helpMenu)

    def buildMaterial(self):
        self.clearFrame()
        Label(self.contentFrame, text = "Center Drill Speed and Feed Calculator", font = ("Open Sans", 14, "bold")).pack(pady=10)
        Label(self.contentFrame, text = "Please select the material you are using:", font = ("Open Sans", 12)).pack()

        # Create radio buttons for material choices
        for material in self.materialChoices:
            Radiobutton(self.contentFrame, text = material, variable = self.selectedMaterial, value = material).pack(anchor = W)
        # Debug
        Label(self.contentFrame, text="Current selection:").pack()
        Label(self.contentFrame, textvariable=self.selectedMaterial, font=('Open Sans', 10, 'italic')).pack()

        Button(self.contentFrame, text ="Next", command = self.buildSize).pack(pady=10)

    def buildSize(self):
        self.clearFrame()
        Label(self.contentFrame, text = f"Material selected: {self.selectedMaterial.get()}").pack()
        Label(self.contentFrame, text = "Enter tool size (1-6):").pack()

        # Add drill size entry and logic here
        Button(self.contentFrame, text = "Back", command = self.buildMaterial).pack()


    def nextWindow(self):
        selected = self.selectedMaterial.get()
        
        # Clear window
        for widget in self.root.winfo_children():
            widget.destroy()

    def newWindow(self):
        newWindow = tk.Toplevel(self.root)
        BFMS_Machine_Shop_App(newWindow)

    def showAbout(self):
        tk.messagebox.showinfo("About", "BFMS Machine Shop App\nVersion 1.0 - 8 May 2025")
    
    def clearFrame(self):
        for widget in self.contentFrame.winfo_children():
            widget.destroy()


if __name__ == "__main__":
    root = tk.Tk()
    app = BFMS_Machine_Shop_App(root)
    root.mainloop()