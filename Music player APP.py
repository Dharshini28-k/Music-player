import tkinter as tk
from tkinter import ttk, filedialog
import pygame
import os

class MusicPlayer:
    def __init__(self, root):
        self.root = root
        self.root.title("Music Player")
        self.root.geometry("400x300")

        pygame.mixer.init()
        self.playing = False
        self.current_song = None
        self.playlist = []

        # UI Elements
        self.song_list = tk.Listbox(root, selectmode=tk.SINGLE, height=10)
        self.song_list.pack(pady=10)

        # Buttons
        controls_frame = ttk.Frame(root)
        controls_frame.pack()
        ttk.Button(controls_frame, text="Open", command=self.open_files).grid(row=0, column=0, padx=5)
        ttk.Button(controls_frame, text="Play", command=self.play_music).grid(row=0, column=1, padx=5)
        ttk.Button(controls_frame, text="Pause", command=self.pause_music).grid(row=0, column=2, padx=5)
        ttk.Button(controls_frame, text="Stop", command=self.stop_music).grid(row=0, column=3, padx=5)
        ttk.Button(controls_frame, text="Next", command=self.next_song).grid(row=0, column=4, padx=5)
        ttk.Button(controls_frame, text="Previous", command=self.prev_song).grid(row=0, column=5, padx=5)

    def open_files(self):
        file_paths = filedialog.askopenfilenames(title="Select Music Files", filetypes=(("Audio Files", "*.mp3 *.wav"),))
        if file_paths:
            self.playlist = list(file_paths)
            self.song_list.delete(0, tk.END)
            for song in self.playlist:
                self.song_list.insert(tk.END, os.path.basename(song))

    def play_music(self):
        if self.song_list.curselection():
            selected_index = self.song_list.curselection()[0]
            self.current_song = self.playlist[selected_index]
            pygame.mixer.music.load(self.current_song)
            pygame.mixer.music.play()
            self.playing = True

    def pause_music(self):
        if self.playing:
            pygame.mixer.music.pause()
            self.playing = False
        else:
            pygame.mixer.music.unpause()
            self.playing = True

    def stop_music(self):
        pygame.mixer.music.stop()
        self.playing = False

    def next_song(self):
        if self.playlist:
            if self.song_list.curselection():
                selected_index = self.song_list.curselection()[0]
                next_index = (selected_index + 1) % len(self.playlist)
                self.song_list.selection_clear(0, tk.END)
                self.song_list.selection_set(next_index)
                self.play_music()
            else:
                self.song_list.selection_set(0)
                self.play_music()
    
    def prev_song(self):
        if self.playlist:
            if self.song_list.curselection():
                selected_index = self.song_list.curselection()[0]
                prev_index = (selected_index - 1) % len(self.playlist)
                self.song_list.selection_clear(0, tk.END)
                self.song_list.selection_set(prev_index)
                self.play_music()
            else:
                self.song_list.selection_set(0)
                self.play_music()

if __name__ == "__main__":
    root = tk.Tk()
    app = MusicPlayer(root)
    root.mainloop()
