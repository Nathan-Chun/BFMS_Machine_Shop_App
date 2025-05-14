import pandas as pd
# import numpy as np
import tkinter as tk
from tkinter import *
from tkinter import messagebox

data = pd.read_csv("Center_Drill_Speeds_and_Feeds.csv")
# print(data.head())
df = pd.DataFrame(data)
# materialChoices=df["Material Description"].unique()
# col1 = df['ISO']
# print(col1)


class BFMS_Machine_Shop_App:
    def __init__(self, root):
        self.root = root
        self.root.title("BFMS Machine Shop App")

        # Create a scrollable canvas
        self.canvas = Canvas(self.root)
        self.scrollbar = Scrollbar(self.root, orient="vertical", command=self.canvas.yview)
        self.scrollableFrame = Frame(self.canvas)

        self.scrollableFrame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )

        # Add different scrolling methods
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)  # For Windows
        self.canvas.bind_all("<Button-4>", self._on_mousewheel)   # For Linux (scroll up)
        self.canvas.bind_all("<Button-5>", self._on_mousewheel)   # For Linux (scroll down)

        self.canvas.create_window((0, 0), window=self.scrollableFrame, anchor="nw")
        self.canvas.configure(yscrollcommand=self.scrollbar.set)

        self.canvas.pack(side="left", fill="both", expand=True)
        self.scrollbar.pack(side="right", fill="y")

        # Initialize selected material
        self.selectedMaterial = tk.StringVar(value="Aluminum")
        self.materialChoices = [df["Material Description"].unique()[i] for i in [1,2,6]]
        self.size = tk.StringVar(value="1")
        self.rowIndex = 10
        self.feedIndex = 10
        self.speed = tk.StringVar(value="0")
        self.feed = tk.StringVar(value="0")

        # Initialize speed and feed column names with default values
        self.speedColumnName = self.size.get() + " Speed"
        self.feedColumnName = self.size.get() + " Feed"


        # print(df.iloc[0])
  
        # # To keep content separate from menu bar
        # self.contentFrame = tk.Frame(self.root)
        # self.contentFrame.pack(fill='both', expand=True)

        # # Initialize selected material
        # self.selectedMaterial = tk.StringVar(value ="Aluminum")
        # self.materialChoices = df["Material Description"].unique()

        # Build Gui
        self.buildMenu()
        self.buildMaterial()
        self.buildSize()

        
        self.resultsFrame = Frame(self.scrollableFrame)
        self.resultsFrame.pack(fill="x", pady=10)
        self.result()

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
        Label(self.scrollableFrame, text="Center Drill Speed and Feed Calculator", font=("Open Sans", 14, "bold")).pack(pady=10)

    def buildMaterial(self):
        # self.clearFrame()
        Label(self.scrollableFrame, text="Step 1:", font=("Open Sans", 14), anchor = "w").pack(fill="x", pady=5)
        Label(self.scrollableFrame, text="Please select the material you are using:", font=("Open Sans", 12)).pack()

        # Create radio buttons for material choices
        for material in self.materialChoices:
            Radiobutton(self.scrollableFrame, text=material, variable=self.selectedMaterial, value=material, command= lambda m=material: [self.setMaterialRow(), self.result()]).pack(anchor=W)

        # Label(self.scrollableFrame, text="Current selection:").pack()
        # Label(self.scrollableFrame, textvariable=self.selectedMaterial, font=('Open Sans', 10, 'italic')).pack()

        # Button(self.scrollableFrame, text="Next", command=self.buildSize).pack(pady=10)

        # self.clearFrame()
        # Label(self.contentFrame, text = "Center Drill Speed and Feed Calculator", font = ("Open Sans", 14, "bold")).pack(pady=10)
        # Label(self.contentFrame, text = "Please select the material you are using:", font = ("Open Sans", 12)).pack()

        # # Create radio buttons for material choices
        # for material in self.materialChoices:
        #     Radiobutton(self.contentFrame, text = material, variable = self.selectedMaterial, value = material).pack(anchor = W)
        # # Debug
        # Label(self.contentFrame, text="Current selection:").pack()
        # Label(self.contentFrame, textvariable=self.selectedMaterial, font=('Open Sans', 10, 'italic')).pack()

        # Button(self.contentFrame, text ="Next", command = self.buildSize).pack(pady=10)
    
    def setMaterialRow(self):
        if self.selectedMaterial.get() == "Aluminum":
            self.rowIndex = 10
        elif self.selectedMaterial.get() == "Low alloy steel":
            self.rowIndex = 4
        elif self.selectedMaterial.get() == "Stainless steel":
            self.rowIndex = 5
        print(self.rowIndex)


    def buildSize(self):
        # self.clearFrame()
        # Label(self.scrollableFrame, text=f"Material selected: {self.selectedMaterial.get()}").pack()
        Label(self.scrollableFrame, text="Step 2:", font=("Open Sans", 14), anchor="w").pack(fill="x", pady=5)
        Label(self.scrollableFrame, text="Please select your tool size:", font=("Open Sans", 12)).pack()
        # Label(self.scrollableFrame, text="Enter tool size (1-6):").pack()
        # Define drill size options
        for i in range(1, 7):
            Radiobutton(self.scrollableFrame, text=str(i), variable=self.size, value=str(i), command= lambda s=i: [self.setSpeedFeed(), self.result()]).pack(anchor=W)

       
        # Add drill size entry and logic here
        # Button(self.scrollableFrame, text="Back", command=self.buildMaterial).pack()
    
        # self.clearFrame()
        # Label(self.contentFrame, text = f"Material selected: {self.selectedMaterial.get()}").pack()
        # Label(self.contentFrame, text = "Enter tool size (1-6):").pack()

        # # Add drill size entry and logic here
        # Button(self.contentFrame, text = "Back", command = self.buildMaterial).pack()

    def setSpeedFeed(self):
        self.speedColumnName = self.size.get() + " Speed"
        self.feedColumnName = self.size.get() + " Feed"
        print(self.speedColumnName)
        print(self.feedColumnName)

    def result(self):
         # Clear previous results
        for widget in self.resultsFrame.winfo_children():
            widget.destroy()
        
        # Update speed and feed vals
        self.speed.set(df[self.speedColumnName][self.rowIndex])
        self.feed.set(df[self.feedColumnName][self.rowIndex])
            
        # Display results
        Label(self.resultsFrame, text="Current selection:").pack()
        Label(self.resultsFrame, textvariable=self.speed, font=('Open Sans', 10, 'italic')).pack()
        Label(self.resultsFrame, textvariable=self.feed, font=('Open Sans', 10, 'italic')).pack()


    def nextWindow(self):
        newWindow = tk.Toplevel(self.root)
        BFMS_Machine_Shop_App(newWindow)
        # selected = self.selectedMaterial.get()
        
        # # Clear window
        # for widget in self.root.winfo_children():
        #     widget.destroy()

    def newWindow(self):
        newWindow = tk.Toplevel(self.root)
        BFMS_Machine_Shop_App(newWindow)

    def showAbout(self):
        tk.messagebox.showinfo("About", "BFMS Machine Shop App\nVersion 1.0 - 8 May 2025")
    
    def clearFrame(self):
        for widget in self.scrollableFrame.winfo_children():
            widget.destroy()
        # for widget in self.contentFrame.winfo_children():
        #     widget.destroy()

    # Scrolling behavior
    def _on_mousewheel(self, event):
        if event.num == 4 or event.delta > 0:  # Scroll up
            self.canvas.yview_scroll(-1, "units")
        elif event.num == 5 or event.delta < 0:  # Scroll down
            self.canvas.yview_scroll(1, "units")

if __name__ == "__main__":
    root = tk.Tk()
    app = BFMS_Machine_Shop_App(root)
    root.mainloop()